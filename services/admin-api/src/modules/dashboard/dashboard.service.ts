import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [
      activeDrivers,
      activeOrders,
      pendingRequests,
      revenueToday,
    ] = await Promise.all([
      this.prisma.rider.count({ where: { isOnline: true } }),
      this.prisma.order.count({ where: { status: { in: ['CONFIRMED', 'PREPARING', 'READY', 'PICKED_UP'] } } }),
      this.prisma.merchant.count({ where: { isVerified: false } }),
      this.prisma.transaction.aggregate({
        where: {
          status: 'SUCCESS',
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
        _sum: {
          amount: true,
        },
      }),
    ]);

    return {
      activeDrivers,
      activeOrders,
      pendingRequests,
      revenueToday: revenueToday._sum.amount || 0,
    };
  }

  async getRecentAlerts() {
    return this.prisma.riskEvent.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        eventType: true,
        riskScore: true,
        decision: true,
        reasons: true,
        createdAt: true,
      },
    });
  }
}
