import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDirectDeliveryDto } from './dto/create-direct-delivery.dto';
import { generateOrderNumber } from '../../common/utils/order-number.util';
import { OrderStatus } from '@prisma/client';
import { DispatchService } from '../dispatch/dispatch.service';

@Injectable()
export class DirectService {
  constructor(
    private prisma: PrismaService,
    private dispatchService: DispatchService,
  ) {}

  async createDelivery(merchantId: string, dto: CreateDirectDeliveryDto) {
    // Find a default store for this merchant to associate the "order" with
    // In a real B2B app, we might have a specific "Direct" store type
    const store = await this.prisma.store.findFirst({
      where: { merchantId, isActive: true }
    });

    if (!store) {
      throw new Error('No active store found for merchant');
    }

    // Create an "Order" record but marked as a Direct Delivery
    // We can use a specific status or metadata for this
    const order = await this.prisma.order.create({
      data: {
        storeId: store.id,
        merchantId: merchantId,
        orderNumber: `DRC-${generateOrderNumber()}`,
        currency: store.currency,
        subtotal: 0, 
        taxAmount: 0,
        deliveryFee: 0, // Fee calculation would happen here based on distance
        totalAmount: 0,
        customerName: dto.customerName,
        customerPhone: dto.customerPhone,
        deliveryAddress: dto.deliveryAddress,
        status: OrderStatus.READY, // Immediate readiness for dispatch
      }
    });

    // Start dispatch flow immediately
    await this.dispatchService.startDispatchFlow(order.id);

    return order;
  }

  async getDeliveryStatus(merchantId: string, deliveryId: string) {
    return this.prisma.order.findFirst({
      where: { id: deliveryId, merchantId },
      include: {
        delivery: true
      }
    });
  }
}
