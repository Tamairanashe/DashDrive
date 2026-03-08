import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OperationsService {
  constructor(private prisma: PrismaService) {}

  async getLiveOrders() {
    return this.prisma.order.findMany({
      where: {
        status: {
          in: ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'ASSIGNED_TO_RIDER', 'PICKED_UP'],
        },
      },
      include: {
        Store: {
          select: {
            name: true,
            Merchant: {
              select: {
                type: true,
              },
            },
          },
        },
        Delivery: {
          include: {
            Rider: {
              select: {
                name: true,
                phone: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async reassignRider(orderId: string, newRiderId: string) {
    const delivery = await this.prisma.delivery.findUnique({
      where: { orderId },
    });

    if (!delivery) {
      throw new NotFoundException('Delivery record not found for this order');
    }

    return this.prisma.delivery.update({
      where: { orderId },
      data: {
        riderId: newRiderId,
        status: 'ASSIGNED',
      },
    });
  }

  async cancelOrder(orderId: string, reason: string) {
    return this.prisma.$transaction([
      this.prisma.order.update({
        where: { id: orderId },
        data: { status: 'CANCELLED' },
      }),
      this.prisma.orderStatusHistory.create({
        data: {
          id: require('crypto').randomUUID(),
          orderId,
          status: 'CANCELLED',
          note: `Admin Cancellation: ${reason}`,
        },
      }),
      this.prisma.delivery.updateMany({
        where: { orderId },
        data: { status: 'CANCELLED' },
      }),
    ]);
  }
}
