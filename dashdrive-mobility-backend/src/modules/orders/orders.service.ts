import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ServiceType } from '@prisma/client';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(private prisma: PrismaService) {}

  async createOrder(userId: string, data: {
    type: ServiceType;
    total_price: number;
    address: string;
    items: { name: string; quantity: number; price: number }[];
    restaurant_id?: string;
  }) {
    this.logger.log(`Creating ${data.type} order for user ${userId}`);

    const order = await this.prisma.order.create({
      data: {
        user_id: userId,
        type: data.type,
        total_price: data.total_price,
        address: data.address,
        restaurant_id: data.restaurant_id,
        items: {
          create: data.items,
        },
      },
      include: { items: true },
    });

    // Create a pending delivery for this order
    await this.prisma.delivery.create({
      data: {
        order_id: order.id,
        status: 'searching',
      },
    });

    return order;
  }

  async getOrder(orderId: string) {
    return this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, delivery: true },
    });
  }

  async updateOrderStatus(orderId: string, status: string) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }
}
