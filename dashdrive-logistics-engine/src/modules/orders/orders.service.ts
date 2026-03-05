import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrdersGateway } from './orders.gateway';
import { generateOrderNumber } from '../../common/utils/order-number.util';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { OrderStatus } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';
import { CommissionService } from '../commission/commission.service';
import { EventBusService } from '../event-bus/event-bus.service';
import { PlatformEvent } from '../../common/events/platform-events';
import { DispatchService } from '../dispatch/dispatch.service';

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
