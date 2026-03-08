import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrdersGateway } from './orders.gateway';
import { generateOrderNumber } from '../../common/utils/order-number.util';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { OrderStatus, WalletOwnerType } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';
import { CommissionService } from '../commission/commission.service';
import { EventBusService } from '../event-bus/event-bus.service';
import { PlatformEvent } from '../../common/events/platform-events';
import { DispatchService } from '../dispatch/dispatch.service';
import { WalletService } from '../wallet/wallet.service';
import { EarningsService } from '../dispatch/earnings.service';

@Injectable()
export class OrdersService {
    constructor(
        private prisma: PrismaService,
        private ordersGateway: OrdersGateway,
        private notificationsService: NotificationsService,
        private commissionService: CommissionService,
        private eventBusService: EventBusService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private dispatchService: DispatchService,
        private walletService: WalletService,
        private earningsService: EarningsService,
    ) { }

    async createOrder(merchantId: string, storeId: string, data: any) {
        const store = await this.prisma.store.findFirst({
            where: { id: storeId, merchantId, isActive: true },
        });

        if (!store) throw new NotFoundException('Store not found or unauthorized');

        // Calculate totals
        const subtotal = data.items.reduce(
            (sum: number, item: any) => sum + item.quantity * item.unitPrice,
            0,
        );

        const taxAmount = (store.taxRate / 100) * subtotal;
        const totalAmount = subtotal + taxAmount + (data.deliveryFee || 0);

        const order = await this.prisma.order.create({
            data: {
                storeId,
                merchantId,
                orderNumber: generateOrderNumber(),
                currency: store.currency,
                subtotal,
                taxAmount,
                deliveryFee: data.deliveryFee || 0,
                totalAmount,
                customerName: data.customerName,
                customerPhone: data.customerPhone,
                deliveryAddress: data.deliveryAddress,
                status: OrderStatus.PENDING,
                items: {
                    create: data.items.map((item: any) => ({
                        productId: item.productId,
                        name: item.name,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        totalPrice: item.quantity * item.unitPrice,
                    })),
                },
                statusHistory: {
                    create: {
                        status: OrderStatus.PENDING,
                        note: 'Order created',
                    },
                },
            },
            include: { items: true },
        });

        // Stock deduction and inventory alerts are now handled asynchronously by the InventoryConsumer
        // reacting to the PlatformEvent.ORDER_CREATED event.

        // Invalidate analytics cache
        await this.cacheManager.del(`analytics:snapshot:${merchantId}:all`);
        await this.cacheManager.del(`analytics:snapshot:${merchantId}:${storeId}`);

        // Notify merchant in real-time (UI)
        this.ordersGateway.emitNewOrder(storeId, order);

        // Publish Order Created Event
        await this.eventBusService.publish(PlatformEvent.ORDER_CREATED, order);

        return order;
    }

    async getStoreOrders(merchantId: string, storeId: string) {
        return this.prisma.order.findMany({
            where: { storeId, merchantId },
            include: { items: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    async updateStatus(orderId: string, merchantId: string, status: OrderStatus, note?: string) {
        const order = await this.prisma.order.findFirst({
            where: { id: orderId, merchantId },
        });

        if (!order) throw new NotFoundException('Order not found');

        await this.prisma.orderStatusHistory.create({
            data: { orderId, status, note },
        });

        const updatedOrder = await this.prisma.order.update({
            where: { id: orderId },
            data: { status },
            include: { items: true },
        });

        // Invalidate analytics cache on milestone updates (e.g., DELIVERED)
        if (status === OrderStatus.DELIVERED) {
            await this.cacheManager.del(`analytics:snapshot:${merchantId}:all`);
            await this.cacheManager.del(`analytics:snapshot:${merchantId}:${order.storeId}`);

            // === FINTECH SETTLEMENT (ZERO-SUM DOUBLE ENTRY) ===
            const commissionAmount = updatedOrder.subtotal * 0.10; // Fixed 10% commission
            const merchantPayout = updatedOrder.subtotal + updatedOrder.taxAmount - commissionAmount;

            try {
                // 1. Merchant Payout
                const merchantWallet = await this.walletService.getWallet(WalletOwnerType.MERCHANT, merchantId, updatedOrder.currency);
                await this.walletService.credit(merchantWallet.id, merchantPayout, updatedOrder.id, `Payout for Order #${updatedOrder.orderNumber}`);

                // 2. Rider Payout (if assigned)
                const delivery = await this.prisma.delivery.findUnique({ where: { orderId: updatedOrder.id }});
                const finalDeliveryFee = delivery?.deliveryFee || updatedOrder.deliveryFee;
                if (delivery && delivery.riderId && finalDeliveryFee > 0) {
                    const riderWallet = await this.walletService.getWallet(WalletOwnerType.RIDER, delivery.riderId, updatedOrder.currency);
                    await this.walletService.credit(riderWallet.id, finalDeliveryFee, updatedOrder.id, `Earnings for Order #${updatedOrder.orderNumber}`);
                    
                    // Record in EarningsService for optimization
                    await this.earningsService.recordEarnings(delivery.riderId, finalDeliveryFee);

                    // Update Rider state: idle time and current load
                    await this.prisma.rider.update({
                        where: { id: delivery.riderId },
                        data: { 
                            lastActiveAt: new Date(),
                            currentLoad: { decrement: 1 }
                        } as any
                    });
                }

                // 3. Platform Escrow Deduction (The escrow pays the Merchant + Rider)
                const escrowWallet = await this.walletService.getWallet(WalletOwnerType.PLATFORM, 'PLATFORM_ESCROW', updatedOrder.currency);
                await this.walletService.debit(escrowWallet.id, merchantPayout + finalDeliveryFee, updatedOrder.id, `Settlement for Order #${updatedOrder.orderNumber}`);
            } catch (err) {
                console.error(`[Fintech] Settlement failed for Order ${updatedOrder.id}:`, err);
            }

            // Publish Order Delivered Event
            await this.eventBusService.publish(PlatformEvent.ORDER_DELIVERED, updatedOrder);
        } else if (status === OrderStatus.CONFIRMED) {
            // Publish Order Confirmed Event
            await this.eventBusService.publish(PlatformEvent.ORDER_CONFIRMED, updatedOrder);
        } else {
            // Publish generic status update event
            const eventMap: Record<string, PlatformEvent> = {
                [OrderStatus.PREPARING]: PlatformEvent.ORDER_PREPARING,
                [OrderStatus.READY]: PlatformEvent.ORDER_READY,
                [OrderStatus.CANCELLED]: PlatformEvent.ORDER_CANCELLED,
            };
            if (eventMap[status]) {
                await this.eventBusService.publish(eventMap[status], updatedOrder);
            }
            if (status === OrderStatus.READY) {
                await this.dispatchService.startDispatchFlow(updatedOrder.id);
            }
        }

        // Notify merchant/customer of status update
        this.ordersGateway.emitStatusUpdate(order.storeId, updatedOrder);

        // Push Notification Triggers for Mobile App
        await this.handleStatusPushNotifications(updatedOrder);

        return updatedOrder;
    }

    private async handleStatusPushNotifications(order: any) {
        const devices = await this.prisma.merchantDevice.findMany({
            where: { merchantId: order.merchantId, NOT: { pushToken: null } },
            select: { pushToken: true }
        });

        if (devices.length === 0) return;

        let title = '';
        let body = '';

        switch (order.status) {
            case OrderStatus.PREPARING:
                title = 'Order in Preparation';
                body = `Order #${order.orderNumber} is now being prepared.`;
                break;
            case OrderStatus.READY:
                title = 'Order Ready!';
                body = `Order #${order.orderNumber} is ready for pickup/delivery.`;
                break;
            case OrderStatus.CANCELLED:
                title = 'Order Cancelled';
                body = `Order #${order.orderNumber} has been cancelled.`;
                break;
        }

        if (title && body) {
            // Log to database for persistent inbox
            await this.prisma.merchantNotification.create({
                data: {
                    merchantId: order.merchantId,
                    title,
                    body,
                    data: { orderId: order.id, status: order.status }
                }
            });

            // Send push to all devices
            await Promise.all(
                devices.map(device =>
                    this.notificationsService.sendPush(
                        device.pushToken!,
                        title,
                        body,
                        { orderId: order.id, status: order.status }
                    )
                )
            );
        }
    }

    async getOrderById(orderId: string, merchantId: string) {
        const order = await this.prisma.order.findFirst({
            where: { id: orderId, merchantId },
            include: {
                items: true,
                statusHistory: {
                    orderBy: { createdAt: 'desc' }
                },
                store: true,
            },
        });

        if (!order) throw new NotFoundException('Order not found');
        return order;
    }
}
