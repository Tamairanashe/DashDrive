import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PricingService, PricingQuoteDto } from '../pricing/pricing.service';
import { DispatchService } from '../dispatch/dispatch.service';
import { Merchant, OrderStatus } from '@prisma/client';

@Injectable()
export class DeliveriesService {
  private readonly logger = new Logger(DeliveriesService.name);

  constructor(
    private prisma: PrismaService,
    private pricingService: PricingService,
    private dispatchService: DispatchService,
  ) {}

  async getQuote(dto: PricingQuoteDto) {
    return this.pricingService.getDeliveryQuote(dto);
  }

  async createDelivery(merchant: Merchant, body: any) {
    const {
      pickup_address,
      dropoff_address,
      pickup_lat,
      pickup_lng,
      dropoff_lat,
      dropoff_lng,
      customer_name,
      customer_phone,
      package_size,
      delivery_type,
      external_reference,
    } = body;

    // 1. Get Country Code from Merchant
    const merchantWithCountry = await this.prisma.merchant.findUnique({
      where: { id: merchant.id },
      include: { country: true, stores: true },
    });

    if (!merchantWithCountry) {
      throw new NotFoundException('Merchant record not found.');
    }

    // Use the first store for now as a "virtual store" for the enterprise API
    const store = merchantWithCountry.stores[0];
    if (!store) {
      throw new NotFoundException(
        'Merchant has no active stores. Please create one in the dashboard.',
      );
    }

    // 2. Get Quote to calculate costs
    const quote = await this.pricingService.getDeliveryQuote({
      countryCode: merchantWithCountry.country.code,
      pickup_lat,
      pickup_lng,
      dropoff_lat,
      dropoff_lng,
      package_size,
      delivery_type,
      merchantPlan: 'ENTERPRISE', // Defaulting API users to Enterprise mods for now
    });

    // 3. Create the Order (Enterprise API creates orders that skip the cart flow)
    // We use a unique order number for transparency
    const orderNumber = `EXT-${Math.random().toString(36).substring(7).toUpperCase()}`;

    const order = await this.prisma.order.create({
      data: {
        storeId: store.id,
        merchantId: merchant.id,
        orderNumber,
        status: OrderStatus.READY, // API orders skip PENDING/CONFIRMED and go straight to READY for dispatch
        currency: merchantWithCountry.country.currency,
        subtotal: quote.price, // Enterprise API doesn't usually track individual items
        totalAmount: quote.price,
        deliveryFee: quote.price,
        customerName: customer_name,
        customerPhone: customer_phone,
        deliveryAddress: dropoff_address,
      },
    });

    // 4. Trigger Dispatch Flow
    await this.dispatchService.startDispatchFlow(order.id);

    return {
      order_id: order.id,
      tracking_number: order.orderNumber,
      status: order.status,
      price: quote.price,
      estimated_arrival: quote.estimated_time,
      currency: order.currency,
      tracking_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/track/${order.id}`,
    };
  }

  async findNearbyOrdersForBatching(orderId: string, radiusKm: number = 2) {
    const referenceOrder = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!referenceOrder || !referenceOrder.pickupLat || !referenceOrder.pickupLng) {
      return [];
    }

    // Find other READY orders without a delivery yet
    const candidateOrders = await this.prisma.order.findMany({
      where: {
        status: OrderStatus.READY,
        id: { not: orderId },
        delivery: null,
      },
    });

    return candidateOrders.filter((order) => {
      if (!order.pickupLat || !order.pickupLng) return false;
      const distance = this.haversineDistance(
        referenceOrder.pickupLat,
        referenceOrder.pickupLng,
        order.pickupLat,
        order.pickupLng,
      );
      return distance <= radiusKm;
    });
  }

  async createBatch(orderIds: string[]) {
    if (orderIds.length < 2) throw new Error('A batch must contain at least 2 orders');

    return this.prisma.$transaction(async (tx) => {
      // 1. Create the Batch record (riderId is null initially)
      const batch = await (tx as any).deliveryBatch.create({
        data: {
          status: 'PENDING',
        },
      });

      // 2. Create Deliveries for each order and link them to the batch
      const deliveries = await Promise.all(
        orderIds.map(async (orderId, index) => {
          return tx.delivery.create({
            data: {
              orderId,
              status: 'PENDING',
              vertical: 'DIRECT',
              sequence: index + 1,
              batchId: batch.id,
            },
          });
        }),
      );

      // 3. Mark orders as having a delivery (optional depending on how status flow works)
      // Actually, usually the presence of a Delivery record marks it.

      return { batch, deliveries };
    });
  }

  private haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  async getPublicStatus(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { delivery: { include: { rider: true } } },
    });

    if (!order) throw new NotFoundException('Delivery not found');

    return {
      id: order.id,
      tracking_number: order.orderNumber,
      status: order.status,
      delivery: order.delivery
        ? {
            status: order.delivery.status,
            rider: order.delivery.rider
              ? {
                  name: order.delivery.rider.name,
                  lat: order.delivery.rider.latitude,
                  lng: order.delivery.rider.longitude,
                }
              : null,
          }
        : null,
    };
  }

  async getDeliveryStatus(merchant: Merchant, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, merchantId: merchant.id },
      include: { delivery: { include: { rider: true } } },
    });

    if (!order) throw new NotFoundException('Delivery not found');

    return {
      id: order.id,
      tracking_number: order.orderNumber,
      status: order.status,
      delivery: order.delivery
        ? {
            status: order.delivery.status,
            rider: order.delivery.rider
              ? {
                  name: order.delivery.rider.name,
                  phone: order.delivery.rider.phone,
                  lat: order.delivery.rider.latitude,
                  lng: order.delivery.rider.longitude,
                }
              : null,
          }
        : null,
    };
  }

  async verifyPin(deliveryId: string, riderId: string, pin: string) {
    const delivery = await this.prisma.delivery.findFirst({
      where: { id: deliveryId, riderId },
    });

    if (!delivery) {
      throw new NotFoundException('Delivery not assigned to this rider.');
    }

    if (delivery.verificationPin !== pin) {
      this.logger.warn(`Incorrect PIN attempt for delivery ${deliveryId} by rider ${riderId}`);
      return { success: false, message: 'Invalid verification PIN' };
    }

    const nextStatus = 
      delivery.status === 'ASSIGNED' ? 'PICKED_UP' : 
      delivery.status === 'PICKED_UP' ? 'DELIVERED' : 
      delivery.status;

    await this.prisma.$transaction([
      this.prisma.delivery.update({
        where: { id: deliveryId },
        data: { 
          status: nextStatus as any,
          deliveredAt: nextStatus === 'DELIVERED' ? new Date() : undefined,
        },
      }),
      this.prisma.order.update({
        where: { id: delivery.orderId },
        data: { 
          status: nextStatus === 'DELIVERED' ? 'COMPLETED' : 'ON_THE_WAY' as any
        },
      }),
    ]);

    this.logger.log(`Delivery ${deliveryId} verified and moved to ${nextStatus}`);
    return { success: true, nextStatus };
  }
}
