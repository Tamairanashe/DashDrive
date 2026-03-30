import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PaymentStatus } from '@prisma/client';
import { PaynowProvider } from './providers/paynow.provider';

@Injectable()
export class PaymentService {
  constructor(
    private prisma: PrismaService,
    private paynow: PaynowProvider,
  ) {}

  async createPayment(data: { 
    order_id: string; 
    amount: number; 
    currency: string; 
    payment_method: string; 
    customer_id: string;
    provider?: string;
  }) {
    const gateway = data.provider || 'unified_gateway';
    
    const transaction = await this.prisma.transaction.create({
      data: {
        id: `TRX-${Date.now()}`,
        orderId: data.order_id,
        amount: data.amount,
        currency: data.currency,
        paymentMethod: data.payment_method,
        gateway: gateway,
        status: PaymentStatus.PENDING,
        merchantId: 'SYSTEM',
        storeId: 'SYSTEM',
        updatedAt: new Date(),
      },
    });

    if (gateway === 'paynow') {
      try {
        const paynowRes = await this.paynow.initiate({
          reference: transaction.id,
          amount: data.amount,
          currency: data.currency,
          authEmail: 'customer@example.com', 
          additionalInfo: `Order ${data.order_id}`,
          returnUrl: `http://localhost:3000/payment/success?id=${transaction.id}`,
          resultUrl: `${process.env.BACKEND_URL || 'http://localhost:8000'}/api/fintech/webhooks/paynow`,
        });

        if (paynowRes.status === 'Error') {
          await this.prisma.transaction.update({
            where: { id: transaction.id },
            data: { status: PaymentStatus.FAILED, updatedAt: new Date() }
          });
          throw new BadRequestException(paynowRes.error || 'Paynow initiation failed');
        }

        return (this.prisma.transaction as any).update({
          where: { id: transaction.id },
          data: {
            gatewayTransactionId: paynowRes.pollurl,
            metadata: paynowRes as any,
            updatedAt: new Date(),
          },
        });
      } catch (err) {
        await this.prisma.transaction.update({
          where: { id: transaction.id },
          data: { status: PaymentStatus.FAILED, updatedAt: new Date() }
        });
        throw err;
      }
    }

    return transaction;
  }

  async initiateBundlePurchase(data: {
    riderId: string;
    bundleId: string;
    amount: number;
    currency: string;
    rides: number;
    expiryDays: number;
  }) {
    // 1. Create a specialized bundle purchase transaction
    const transaction = await (this.prisma.transaction as any).create({
      data: {
        id: `BNDL-${Date.now()}`,
        orderId: null, // Decentralized from platform orders
        amount: data.amount,
        currency: data.currency,
        paymentMethod: 'paynow',
        gateway: 'paynow',
        status: PaymentStatus.PENDING,
        merchantId: 'SYSTEM',
        storeId: 'SYSTEM',
        metadata: {
          riderId: data.riderId,
          bundleId: data.bundleId,
          rides: data.rides,
          expiryDays: data.expiryDays,
          type: 'RIDER_RIDE_BUNDLE'
        },
        updatedAt: new Date(),
      },
    });

    // 2. Initiate with Paynow
    try {
      const paynowRes = await this.paynow.initiate({
        reference: transaction.id,
        amount: data.amount,
        currency: data.currency,
        authEmail: 'driver@dashdrive.app', // In real app, get from rider profile
        additionalInfo: `Ride Bundle: ${data.rides} Rides`,
        returnUrl: `http://localhost:3000/driver/bundles/success?id=${transaction.id}`,
        resultUrl: `${process.env.BACKEND_URL || 'http://localhost:8000'}/api/fintech/webhooks/paynow`,
      });

      if (paynowRes.status === 'Error') {
        await this.prisma.transaction.update({
          where: { id: transaction.id },
          data: { status: PaymentStatus.FAILED, updatedAt: new Date() }
        });
        throw new BadRequestException(paynowRes.error || 'Paynow initiation failed');
      }

      return (this.prisma.transaction as any).update({
        where: { id: transaction.id },
        data: {
          gatewayTransactionId: paynowRes.pollurl,
          metadata: { ...(transaction as any).metadata, ...paynowRes },
          updatedAt: new Date(),
        },
      });
    } catch (err) {
      await this.prisma.transaction.update({
        where: { id: transaction.id },
        data: { status: PaymentStatus.FAILED, updatedAt: new Date() }
      });
      throw err;
    }
  }

  async fulfillTransaction(transactionId: string, gatewayFields: any) {
    return this.prisma.$transaction(async (tx) => {
      const trx = await (tx.transaction as any).findUnique({
        where: { id: transactionId },
      });

      if (!trx || trx.status === PaymentStatus.SUCCESS) return trx;

      const metadata = (trx as any).metadata;

      // 1. Ride Bundle Fulfillment
      if (metadata?.type === 'RIDER_RIDE_BUNDLE' && metadata?.riderId) {
        await (tx as any).riderRideBundle.create({
          data: {
            riderId: metadata.riderId,
            totalRides: metadata.rides,
            remainingRides: metadata.rides,
            pricePaid: trx.amount,
            currency: trx.currency,
            expiresAt: metadata.expiryDays ? new Date(Date.now() + metadata.expiryDays * 24 * 60 * 60 * 1000) : null,
          }
        });
      }

      // 2. Utility Fulfillment (ZESA tokens)
      let extraMeta = {};
      const responseData = gatewayFields.notes || gatewayFields.data || '';
      if (metadata?.type === 'UTILITY_PAYMENT') {
        const token = responseData.match(/\d{20}/)?.[0];
        if (token) {
          extraMeta = { token, receipt: gatewayFields.paynowreference };
        }
      }

      return (tx.transaction as any).update({
        where: { id: transactionId },
        data: {
          status: PaymentStatus.SUCCESS,
          gatewayTransactionId: gatewayFields.paynowreference,
          metadata: { ...(trx.metadata as any), ...extraMeta },
          updatedAt: new Date(),
        }
      });
    });
  }

  async getRiderBundles(riderId: string) {
    return (this.prisma as any).riderRideBundle.findMany({
      where: { riderId, isActive: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getStatus(transactionId: string) {
    const trx = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
    });
    
    if (!trx) throw new BadRequestException('Transaction not found');

    if (trx.gateway === 'paynow' && trx.status === PaymentStatus.PENDING && trx.gatewayTransactionId) {
      const pollRes = await this.paynow.checkStatus(trx.gatewayTransactionId);
      if (pollRes.status === 'Paid' || pollRes.status === 'Awaiting Delivery') {
        return this.fulfillTransaction(transactionId, pollRes);
      } else if (pollRes.status === 'Cancelled' || pollRes.status === 'Refused') {
        return (this.prisma.transaction as any).update({
          where: { id: transactionId },
          data: { status: PaymentStatus.FAILED, updatedAt: new Date() }
        });
      }
    }

    return trx;
  }

  async refund(transactionId: string, amount: number, reason: string) {
    return this.prisma.$transaction(async (tx) => {
      const trx = await tx.transaction.findUnique({
        where: { id: transactionId },
      });

      if (!trx) throw new BadRequestException('Transaction not found');
      if (trx.status !== PaymentStatus.SUCCESS) {
        throw new BadRequestException('Only successful transactions can be refunded');
      }

      const updatedTrx = await tx.transaction.update({
        where: { id: transactionId },
        data: {
          status: PaymentStatus.REFUNDED,
          updatedAt: new Date(),
        },
      });

      return updatedTrx;
    });
  }

  async createPOSTransaction(data: {
    terminalId: string;
    storeId: string;
    amount: number;
    currency: string;
    externalRef: string;
    metadata?: any;
  }) {
    const store = await this.prisma.store.findUnique({
      where: { id: data.storeId },
      select: { merchantId: true }
    });

    if (!store) throw new BadRequestException('Store not found');

    return this.prisma.transaction.create({
      data: {
        id: `POS-${Date.now()}`,
        amount: data.amount,
        currency: data.currency,
        paymentMethod: 'pos_terminal',
        gateway: 'physical_terminal',
        gatewayTransactionId: data.externalRef,
        status: PaymentStatus.SUCCESS, // POS transactions are usually pre-authorized/cleared
        storeId: data.storeId,
        merchantId: store.merchantId,
        metadata: {
          terminalId: data.terminalId,
          type: 'POS_TERMINAL_SYNC',
          ...data.metadata,
        },
        updatedAt: new Date(),
      },
    });
  }

  async getAllTransactions() {
    return this.prisma.transaction.findMany({
      include: {
        Order: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }
}
