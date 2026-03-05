import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class MobileNotificationsService {
    constructor(private prisma: PrismaService) { }

    async listNotifications(merchantId: string, page: number = 1, limit: number = 20) {
        return this.prisma.merchantNotification.findMany({
            where: { merchantId },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        });
    }

    async markAsRead(id: string, merchantId: string) {
        return this.prisma.merchantNotification.updateMany({
            where: { id, merchantId },
            data: { isRead: true },
        });
    }

    async createNotification(merchantId: string, title: string, body: string, data?: any) {
        return this.prisma.merchantNotification.create({
            data: {
                merchantId,
                title,
                body,
                data,
            },
        });
    }
}
