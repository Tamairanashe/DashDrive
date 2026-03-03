import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DeliveryStatus, OrderStatus, RiskEventType, RiskActorType, RiskDecision } from '@prisma/client';
import { FraudService } from '../fraud/fraud.service';
import { NotificationsService } from '../notifications/notifications.service';
import { DispatchService } from '../dispatch/dispatch.service';
import { RidersService } from '../riders/riders.service';

@Injectable()
export class DeliveryService {
    constructor(
        private prisma: PrismaService,
        private notificationsService: NotificationsService,
        private dispatchService: DispatchService,
        private ridersService: RidersService,
        private fraudService: FraudService,
    ) { }

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

        // Increment rider load for AI dispatch
        await this.ridersService.incrementLoad(riderId);

        // Notify via multi-channel
        const deliveryWithOrder = await this.getDeliveryByOrder(orderId);
        if (deliveryWithOrder?.rider && deliveryWithOrder.order) {
            await this.notificationsService.notifyRiderAssigned(
                orderId,
                deliveryWithOrder.rider,
                { phone: deliveryWithOrder.order.customerPhone }
            );
        }

        return updatedDelivery;
    }

    async autoAssignRider(orderId: string, countryCode?: string) {
        // Use AI Dispatch Service to find the best rider
        let bestRider;
        try {
            bestRider = await this.dispatchService.findBestRider(orderId);
        } catch (error) {
            return null; // Handle "No riders available" gracefully
        }

        return this.assignRider(orderId, bestRider.id);
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

        // Decrement rider load if delivered or cancelled
        if (status === DeliveryStatus.DELIVERED) {
            if (delivery.riderId) {
                // Fraud check for delivery collusion
                const risk = await this.fraudService.evaluate(
                    RiskEventType.DELIVERY,
                    delivery.riderId,
                    RiskActorType.RIDER,
                    delivery.orderId,
                );

                if (risk.decision === RiskDecision.BLOCKED) {
                    // In a real scenario, we might still mark it delivered but hold the funds
                    // For now, we'll flag it
                    this.prisma.riskEvent.update({
                        where: { id: risk.id },
                        data: { reasons: { ...(risk.reasons as any), note: 'Critical risk on delivery' } }
                    });
                }
                await this.ridersService.decrementLoad(delivery.riderId);
            }
        } else if (status === DeliveryStatus.CANCELLED) {
            if (delivery.riderId) {
                await this.ridersService.decrementLoad(delivery.riderId);
            }
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
