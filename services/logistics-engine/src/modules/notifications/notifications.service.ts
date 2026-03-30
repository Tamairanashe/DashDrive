import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private notificationQueue: any;

  constructor(private prisma: PrismaService) {
    this.initQueue();
  }

  private async initQueue() {
    const useMock = process.env.USE_MOCK_REDIS === 'true';
    if (useMock) {
      this.logger.warn(
        '🚀 NotificationsService: Queue skipped (mock mode — notifications logged only)',
      );
      return;
    }

    try {
      const { Queue } = await import('bullmq');
      this.notificationQueue = new Queue('notifications', {
        connection: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379'),
        },
      });
      this.notificationQueue.on('error', (error) => {
        this.logger.error(`BullMQ Queue Error: ${error.message}`);
      });
      this.logger.log('🚀 Notifications Queue Initialized');
    } catch (error) {
      this.logger.error(
        `Failed to initialize Notifications Queue: ${error.message}`,
      );
    }
  }

  async sendEmail(to: string, subject: string, template: string, context: any) {
    if (!this.notificationQueue) {
      this.logger.warn(`Queue not ready, skipping email to ${to}`);
      return;
    }
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
    if (!targetToken) return;
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
    // Fetch merchant push token
    const merchant = await (this.prisma.merchant as any).findUnique({
      where: { id: order.merchantId },
      select: { pushToken: true },
    });

    if (merchant?.pushToken) {
      await this.sendPush(
        merchant.pushToken,
        'New Order Confirmed!',
        `Order #${order.orderNumber} is ready for processing.`,
        { orderId: order.id },
      );
    }

    // Notify Customer
    if (order.customerPhone) {
      await this.sendSMS(
        order.customerPhone,
        `Dashdrive Mart: Your order #${order.orderNumber} has been confirmed!`,
      );
    }
  }

  async notifyRiderAssigned(orderId: string, rider: any, customerDetails: any) {
    if (customerDetails.phone) {
      await this.sendSMS(
        customerDetails.phone,
        `Dashdrive Mart: Rider ${rider.name} has been assigned to your order!`,
      );
    }
  }

  async notifyDriverApproaching(parentId: string, studentName: string) {
    // In a real app, we'd fetch the parent's push token/phone from the DB
    this.logger.log(
      `Notifying parent ${parentId} that driver is approaching for ${studentName}`,
    );
    // Mock push for now
    await this.sendPush(
      'parent-push-token',
      'Driver Approaching!',
      `The driver is 5 minutes away for ${studentName}'s school run.`,
      { studentName },
    );
  }

  async notifySafeDropoff(parentId: string, studentName: string) {
    this.logger.log(
      `Notifying parent ${parentId} of safe drop-off for ${studentName}`,
    );
    await this.sendPush(
      'parent-push-token',
      'Safe Drop-off Confirmed!',
      `${studentName} has been safely dropped off at school.`,
      { studentName },
    );
  }
}
