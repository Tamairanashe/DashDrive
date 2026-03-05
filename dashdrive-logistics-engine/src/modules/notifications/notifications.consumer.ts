import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { PlatformEvent } from '../../common/events/platform-events';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '../../prisma/prisma.service';

@Controller()
export class NotificationsConsumer {
    private readonly logger = new Logger(NotificationsConsumer.name);

    constructor(
        private readonly notificationsService: NotificationsService,
        private readonly prisma: PrismaService,
    ) { }

    @EventPattern(PlatformEvent.ORDER_CREATED)
    async handleOrderCreated(@Payload() data: any) {
        this.logger.log(`Received ${PlatformEvent.ORDER_CREATED} event`);
        await this.notificationsService.notifyOrderConfirmed(data);
    }

    @EventPattern(PlatformEvent.ORDER_DELIVERED)
    async handleOrderDelivered(@Payload() data: any) {
        this.logger.log(`Received ${PlatformEvent.ORDER_DELIVERED} event`);

        // Fetch all merchant devices to send push
        const devices = await this.prisma.merchantDevice.findMany({
            where: { merchantId: data.merchantId, NOT: { pushToken: null } },
            select: { pushToken: true }
        });

        for (const device of devices) {
            await this.notificationsService.sendPush(
                device.pushToken!,
                'Order Delivered! 🎊',
                `Order #${data.orderNumber} has been successfully delivered.`,
                { orderId: data.id }
            );
        }
    }

    @EventPattern(PlatformEvent.ORDER_PREPARING)
    @EventPattern(PlatformEvent.ORDER_READY)
    @EventPattern(PlatformEvent.ORDER_CANCELLED)
    async handleOrderStatusUpdate(@Payload() data: any) {
        this.logger.log(`Received status update for order ${data.orderNumber}: ${data.status}`);

        const statusConfig = {
            'PREPARING': { title: 'Order in Preparation', body: `Order #${data.orderNumber} is now being prepared.` },
            'READY': { title: 'Order Ready!', body: `Order #${data.orderNumber} is ready for pickup/delivery.` },
            'CANCELLED': { title: 'Order Cancelled', body: `Order #${data.orderNumber} has been cancelled.` },
        };

        const config = statusConfig[data.status as keyof typeof statusConfig];
        if (!config) return;

        const devices = await this.prisma.merchantDevice.findMany({
            where: { merchantId: data.merchantId, NOT: { pushToken: null } },
            select: { pushToken: true }
        });

        for (const device of devices) {
            await this.notificationsService.sendPush(
                device.pushToken!,
                config.title,
                config.body,
                { orderId: data.id, status: data.status }
            );
        }
    }

    @EventPattern(PlatformEvent.LOW_STOCK_ALERT)
    async handleInventoryLowStock(@Payload() data: any) {
        this.logger.warn(`Received ${PlatformEvent.LOW_STOCK_ALERT} for ${data.productName}`);

        const title = 'Low Stock Alert 📦';
        const body = `"${data.productName}" is running low (${data.stockLevel} items left).`;

        // Create persistent notification
        await this.prisma.merchantNotification.create({
            data: {
                merchantId: data.merchantId,
                title,
                body,
                data: { productId: data.productId, stock: data.stockLevel }
            }
        });

        // Broadcast push to all devices
        const devices = await this.prisma.merchantDevice.findMany({
            where: { merchantId: data.merchantId, NOT: { pushToken: null } },
            select: { pushToken: true }
        });

        for (const device of devices) {
            await this.notificationsService.sendPush(
                device.pushToken!,
                title,
                body,
                { productId: data.productId, stock: data.stockLevel }
            );
        }
    }
}
