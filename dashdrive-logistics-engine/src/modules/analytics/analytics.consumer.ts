import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { PlatformEvent } from '../../common/events/platform-events';
import { PrismaService } from '../../prisma/prisma.service';

@Controller()
export class AnalyticsConsumer {
  private readonly logger = new Logger(AnalyticsConsumer.name);

  constructor(private readonly prisma: PrismaService) {}

  @EventPattern(PlatformEvent.ORDER_DELIVERED)
  async handleOrderDelivered(@Payload() data: any) {
    this.logger.log(
      `Received ${PlatformEvent.ORDER_DELIVERED} event for order ${data.orderNumber}`,
    );

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    try {
      await this.prisma.merchantDailyStats.upsert({
        where: {
          storeId_date: {
            storeId: data.storeId,
            date: startOfToday,
          },
        },
        update: {
          ordersCount: { increment: 1 },
          revenue: { increment: data.totalAmount },
        },
        create: {
          merchantId: data.merchantId,
          storeId: data.storeId,
          date: startOfToday,
          ordersCount: 1,
          revenue: data.totalAmount,
        },
      });
      this.logger.log(
        `Successfully updated daily stats for store ${data.storeId}`,
      );
    } catch (error) {
      this.logger.error(`Failed to update daily stats: ${error.message}`);
    }
  }
}
