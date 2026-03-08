import { Injectable, NotFoundException } from '@nestjs/common';
import { WebhooksService } from '../webhooks/webhooks.service';
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
        private webhooksService: WebhooksService,
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

            // Fire Webhook
            await this.webhooksService.dispatch(
                deliveryWithOrder.order.merchantId,
                'delivery.assigned',
                {
                    delivery_id: updatedDelivery.id,
                    order_id: orderId,
                    status: updatedDelivery.status,
                    rider: {
                        name: deliveryWithOrder.rider.name,
                        phone: deliveryWithOrder.rider.phone
                    }
                }
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

    async updateStatus(orderId: string, status: DeliveryStatus, pin?: string) {
        const delivery = await this.prisma.delivery.findUnique({
            where: { orderId },
        });

        if (!delivery) throw new NotFoundException('Delivery not found');

        // Step 14: PIN Verification
        if (status === DeliveryStatus.DELIVERED && (delivery as any).verificationPin) {
            if (pin !== (delivery as any).verificationPin) {
                throw new Error('Invalid verification PIN. Passenger must confirm delivery.');
            }
        }

        const updatedDelivery = await this.prisma.delivery.update({
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

        // Handle Credit Integrity and Fraud (Step 14)
        if (status === DeliveryStatus.DELIVERED) {
            if (updatedDelivery.riderId) {
                // 1. Threshold Checks (Anti-Cheating)
                const pickupTime = updatedDelivery.pickupTime ? new Date(updatedDelivery.pickupTime).getTime() : 0;
                const deliveredTime = new Date().getTime();
                const durationMinutes = (deliveredTime - pickupTime) / 60000;
                const distanceKm = updatedDelivery.distanceKm || 0;

                let fraudAlert = false;
                if (distanceKm < 0.5 || durationMinutes < 3) {
                    fraudAlert = true;
                    await (this.prisma.rider as any).update({
                        where: { id: updatedDelivery.riderId },
                        data: { fraudScore: { increment: 1.5 } }
                    });
                }

                // 2. Fraud check for delivery collusion
                const risk = await this.fraudService.evaluate(
                    RiskEventType.DELIVERY,
                    updatedDelivery.riderId,
                    RiskActorType.RIDER,
                    updatedDelivery.orderId,
                );

                if (risk.decision === RiskDecision.BLOCKED || fraudAlert) {
                    await this.prisma.riskEvent.update({
                        where: { id: (risk as any).id || 'temporary-id' },
                        data: { reasons: { ...(risk.reasons as any), note: fraudAlert ? 'Anti-Cheating threshold violated (Short trip)' : 'Critical risk on delivery' } }
                    }).catch(() => {}); // Handle if risk event doesn't exist
                }

                await this.ridersService.decrementLoad(updatedDelivery.riderId);

                // 3. Finalize Credit Consumption (Decrement Reserved)
                await (this.prisma.rider as any).update({
                    where: { id: updatedDelivery.riderId },
                    data: {
                        reservedCredits: { decrement: 1 }
                    }
                });

                // Record transaction
                await (this.prisma as any).creditTransaction.create({
                    data: {
                        riderId: updatedDelivery.riderId,
                        amount: 0,
                        credits: 1,
                        type: 'CONSUMPTION'
                    }
                });
            }
        } else if (status === DeliveryStatus.CANCELLED) {
            if (updatedDelivery.riderId) {
                await this.ridersService.decrementLoad(updatedDelivery.riderId);

                // Step 14: Refund Reserved Credit on Cancellation
                await (this.prisma.rider as any).update({
                    where: { id: updatedDelivery.riderId },
                    data: {
                        reservedCredits: { decrement: 1 },
                        rideCredits: { increment: 1 },
                        cancellationRate: { increment: 0.05 } // Track cancellation abuse
                    }
                });
            }
        }

        // Fire Webhook for status changes
        const fullOrder = await this.prisma.order.findUnique({
            where: { id: orderId }
        });
        if (fullOrder) {
            await this.webhooksService.dispatch(
                fullOrder.merchantId,
                'delivery.status_changed',
                {
                    delivery_id: delivery.id,
                    order_id: orderId,
                    status: delivery.status,
                    timestamp: new Date().toISOString()
                }
            );
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
