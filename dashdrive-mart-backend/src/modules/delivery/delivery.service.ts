import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DeliveryStatus, OrderStatus } from '@prisma/client';

@Injectable()
export class DeliveryService {
    constructor(private prisma: PrismaService) { }

    async createDelivery(orderId: string) {
        return this.prisma.delivery.create({
            data: {
                orderId,
            },
        });
    }

    async assignRider(orderId: string, riderId: string) {
        const delivery = await this.prisma.delivery.findUnique({
            where: { orderId },
        });

        if (!delivery) {
            throw new NotFoundException('Delivery not found');
        }

        // Update delivery status
        const updatedDelivery = await this.prisma.delivery.update({
            where: { orderId },
            data: {
                riderId,
                status: DeliveryStatus.ASSIGNED,
            },
        });

        // Update order status contextually
        await this.prisma.order.update({
            where: { id: orderId },
            data: { status: OrderStatus.ASSIGNED_TO_RIDER }
        });

        return updatedDelivery;
    }

    async autoAssignRider(orderId: string, countryCode: string) {
        const availableRiders = await this.prisma.rider.findMany({
            where: {
                isOnline: true,
                isActive: true,
                countryCode,
            },
            take: 1, // Simple nearest-neighbor proxy logic for MVP
        });

        if (!availableRiders.length) {
            return null; // Handle "No riders available" gracefully for batching/retries
        }

        return this.assignRider(orderId, availableRiders[0].id);
    }

    async updateStatus(orderId: string, status: DeliveryStatus) {
        const delivery = await this.prisma.delivery.update({
            where: { orderId },
            data: {
                status,
                deliveredAt: status === DeliveryStatus.DELIVERED ? new Date() : undefined,
                pickupTime: status === DeliveryStatus.PICKED_UP ? new Date() : undefined,
            },
        });

        // Map logistics status back to Order status for customer visibility
        let orderStatus: OrderStatus | undefined;
        if (status === DeliveryStatus.PICKED_UP) orderStatus = OrderStatus.PICKED_UP;
        else if (status === DeliveryStatus.DELIVERED) orderStatus = OrderStatus.DELIVERED;
        else if (status === DeliveryStatus.CANCELLED) orderStatus = OrderStatus.CANCELLED;

        if (orderStatus) {
            await this.prisma.order.update({
                where: { id: orderId },
                data: { status: orderStatus }
            });
        }

        return delivery;
    }

    async getDeliveryByOrder(orderId: string) {
        return this.prisma.delivery.findUnique({
            where: { orderId },
            include: {
                rider: true,
                order: true,
            },
        });
    }
}
