import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class NotificationsService {
    private readonly logger = new Logger(NotificationsService.name);
    private notificationQueue: Queue;

    constructor() {
        this.notificationQueue = new Queue('notifications', {
            connection: {
                host: process.env.REDIS_HOST || 'localhost',
                port: parseInt(process.env.REDIS_PORT || '6379'),
            },
        });
    }

    async sendEmail(to: string, subject: string, template: string, context: any) {
        this.logger.log(`Queueing email to ${to}: ${subject}`);
        await this.notificationQueue.add('send-email', {
            type: 'EMAIL',
            to,
            subject,
            template,
            context,
        });
    }

    async sendSMS(phoneNumber: string, message: string) {
        this.logger.log(`Queueing SMS to ${phoneNumber}`);
        await this.notificationQueue.add('send-sms', {
            type: 'SMS',
            phoneNumber,
            message,
        });
    }

    async sendPush(targetToken: string, title: string, body: string, data?: any) {
        this.logger.log(`Queueing Push notification to ${targetToken}`);
        await this.notificationQueue.add('send-push', {
            type: 'PUSH',
            targetToken,
            title,
            body,
            data,
        });
    }

    // Helper methods for specific business events
    async notifyOrderConfirmed(order: any) {
        // Notify Merchant
        await this.sendPush(
            'merchant_topic', // Simplified
            'New Order Confirmed!',
            `Order #${order.orderNumber} is ready for processing.`,
            { orderId: order.id }
        );

        // Notify Customer
        if (order.customerPhone) {
            await this.sendSMS(
                order.customerPhone,
                `Dashdrive Mart: Your order #${order.orderNumber} has been confirmed!`
            );
        }
    }

    async notifyRiderAssigned(orderId: string, rider: any, customerDetails: any) {
        if (customerDetails.phone) {
            await this.sendSMS(
                customerDetails.phone,
                `Dashdrive Mart: Rider ${rider.name} has been assigned to your order!`
            );
        }
    }
}
