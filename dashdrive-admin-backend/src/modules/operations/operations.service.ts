import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RealTimeGateway } from '../real-time/real-time.gateway';
import { PlatformEvent, AdminEntityUpdatePayload } from '../../common/events/platform-events';

@Injectable()
export class OperationsService {
  constructor(
    private prisma: PrismaService,
    private realTimeGateway: RealTimeGateway
  ) {}

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

    const updatedDelivery = await this.prisma.delivery.update({
      where: { orderId },
      data: {
        riderId: newRiderId,
        status: 'ASSIGNED',
      },
    });

    const eventPayload: AdminEntityUpdatePayload = {
      entityType: 'ORDER',
      entityId: orderId,
      action: 'PATCH',
      diff: { riderId: newRiderId, status: 'RIDER_REASSIGNED' },
      timestamp: new Date().toISOString(),
    };

    this.realTimeGateway.broadcastEvent(PlatformEvent.ENTITY_DIFF_UPDATED, eventPayload);

    return updatedDelivery;
  }

  async cancelOrder(orderId: string, reason: string) {
    const result = await this.prisma.$transaction([
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

    const eventPayload: AdminEntityUpdatePayload = {
      entityType: 'ORDER',
      entityId: orderId,
      action: 'UPDATE',
      diff: { status: 'CANCELLED', cancellationReason: reason },
      timestamp: new Date().toISOString(),
    };

    this.realTimeGateway.broadcastEvent(PlatformEvent.ENTITY_DIFF_UPDATED, eventPayload);

    return result;
  }
}
