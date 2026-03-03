import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrdersGateway } from './orders.gateway';
import { generateOrderNumber } from '../../common/utils/order-number.util';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { OrderStatus } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';
import { CommissionService } from '../commission/commission.service';

@Injectable()
export class OrdersService {
    constructor(
        private prisma: PrismaService,
        private ordersGateway: OrdersGateway,
        private notificationsService: NotificationsService,
        private commissionService: CommissionService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
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

        // Deduct stock (important for marketplace)
        for (const item of data.items) {
            await this.prisma.product.update({
                where: { id: item.productId },
                data: {
                    stock: {
                        decrement: item.quantity,
                    },
                },
            });
        }

        // Invalidate analytics cache
        await this.cacheManager.del(`analytics:snapshot:${merchantId}:all`);
        await this.cacheManager.del(`analytics:snapshot:${merchantId}:${storeId}`);

        // Notify merchant in real-time
        this.ordersGateway.emitNewOrder(storeId, order);

        // Notify via multi-channel (Final Elite Module integration)
        await this.notificationsService.notifyOrderConfirmed(order);

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

            // Trigger Automated Settlement
            await this.commissionService.processOrderSettlement(orderId);
        }

        // Notify merchant/customer of status update
        this.ordersGateway.emitStatusUpdate(order.storeId, updatedOrder);

        return updatedOrder;
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
