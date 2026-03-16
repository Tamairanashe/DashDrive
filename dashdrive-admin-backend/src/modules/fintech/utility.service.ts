import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PaynowProvider } from './providers/paynow.provider';
import { PaymentStatus } from '@prisma/client';

@Injectable()
export class UtilityService {
  constructor(
    private prisma: PrismaService,
    private paynow: PaynowProvider,
  ) {}

  async verifyBill(provider: string, accountNumber: string) {
    // Fetch biller from database by ID or slug/code
    const biller = await (this.prisma as any).biller.findFirst({
      where: {
        OR: [
          { name: { contains: provider, mode: 'insensitive' } },
          { billerCode: provider.toUpperCase() }
        ],
        isActive: true
      }
    });

    if (!biller) {
      // Fallback to mock for unknown providers if not found in DB
      return {
        provider,
        account_number: accountNumber,
        customer_name: 'Customer (Unverified)',
        outstanding_amount: 0.00,
        currency: 'USD',
      };
    }

    const res = await this.paynow.validateUtilityAccount({
      billerCode: biller.billerCode,
      accountNumber,
      currency: 'USD',
    });

    if (res.status === 'Error') {
      throw new BadRequestException(res.error || 'Account verification failed');
    }

    return {
      provider,
      account_number: accountNumber,
      customer_name: res.name || 'Verified Customer',
      outstanding_amount: parseFloat(res.amount || '0'),
      currency: 'USD',
      metadata: res,
    };
  }

  async payBill(data: {
    provider: string;
    accountNumber: string;
    amount: number;
    currency: string;
    userId: string;
  }) {
    const transactionId = `UTIL-${Date.now()}`;

    // 1. Create Transaction record
    const transaction = await (this.prisma.transaction as any).create({
      data: {
        id: transactionId,
        orderId: null, // Decentralized from platform orders
        amount: data.amount,
        currency: data.currency,
        paymentMethod: 'paynow',
        gateway: 'paynow',
        status: PaymentStatus.PENDING,
        merchantId: 'SYSTEM',
        storeId: 'SYSTEM',
        metadata: {
          userId: data.userId,
          provider: data.provider,
          accountNumber: data.accountNumber,
          type: 'UTILITY_PAYMENT'
        },
        updatedAt: new Date(),
      }
    });

    // 2. Initiate with Paynow
    const paynowRes = await this.paynow.initiate({
      reference: transactionId,
      amount: data.amount,
      currency: data.currency,
      authEmail: 'user@dashdrive.app',
      additionalInfo: `${data.provider} Payment: ${data.accountNumber}`,
      returnUrl: `http://localhost:3000/fintech/utility/success?id=${transactionId}`,
      resultUrl: `${process.env.BACKEND_URL || 'http://localhost:8000'}/api/fintech/webhooks/paynow`,
    });

    if (paynowRes.status === 'Error') {
      await this.prisma.transaction.update({
        where: { id: transactionId },
        data: { status: PaymentStatus.FAILED, updatedAt: new Date() }
      });
      throw new BadRequestException(paynowRes.error || 'Payment initiation failed');
    }

    return (this.prisma.transaction as any).update({
      where: { id: transactionId },
      data: {
        gatewayTransactionId: paynowRes.pollurl,
        metadata: { ...(transaction.metadata as any), ...paynowRes },
        updatedAt: new Date(),
      }
    });
  }

  async topupAirtime(phoneNumber: string, network: string, amount: number) {
    // Airtime usually follows a similar BillPay flow but with specific airtime biller codes
    // For brevity, we route through payBill with airtime-specific config
    return this.payBill({
      provider: network,
      accountNumber: phoneNumber,
      amount,
      currency: 'USD',
      userId: 'system-user', // Should be dynamic
    });
  }

  async purchaseData(phoneNumber: string, bundleId: string) {
    // Logic for data bundles
    return {
      transaction_id: `DATA_${Date.now()}`,
      status: 'success',
      phone_number: phoneNumber,
      bundle_id: bundleId,
    };
  }
}
