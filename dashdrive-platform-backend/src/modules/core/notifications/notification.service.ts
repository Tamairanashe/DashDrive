import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

export enum NotificationType {
  PUSH = 'PUSH',
  SMS = 'SMS',
  EMAIL = 'EMAIL',
}

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private prisma: PrismaService) {}

  async sendNotification(data: {
    userId: string;
    title: string;
    message: string;
    type: NotificationType;
    metadata?: any;
  }) {
    this.logger.log(`Sending ${data.type} notification to user ${data.userId}: ${data.title}`);

    // Here we would integrate with external providers:
    // PUSH -> Firebase (FCM)
    // SMS -> Twilio / Infobip
    // EMAIL -> SendGrid / Postmark
    
    // For now, we simulate success and persist to database history
    return this.prisma.appNotification.create({
      data: {
        user_id: data.userId,
        title: data.title,
        message: data.message,
        type: data.type.toLowerCase(),
        metadata: data.metadata || {},
        status: 'sent',
      },
    });
  }

  async getUserNotifications(userId: string) {
    return this.prisma.appNotification.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      take: 50,
    });
  }

  async markAsRead(notificationId: string) {
    return this.prisma.appNotification.update({
      where: { id: notificationId },
      data: { status: 'read' },
    });
  }
}
