import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PredictionService {
  constructor(private prisma: PrismaService) {}

  async getDemandForecast(city: string) {
    // Simple logic for phase 8: Moving average of last 3 hours
    const now = new Date();
    const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);

    const recentOrders = await this.prisma.order.count({
      where: {
        store: { city },
        createdAt: { gte: threeHoursAgo },
      },
    });

    const hourlyAverage = recentOrders / 3;

    // Generating a 4-hour forecast with subtle variations
    const forecast = [1, 2, 3, 4].map((hour) => {
      const time = new Date(now.getTime() + hour * 60 * 60 * 1000);
      const trend = 1 + (Math.random() - 0.5) * 0.2; // +/- 10% variation
      return {
        time: time.toISOString(),
        predictedOrders: Math.round(hourlyAverage * trend),
      };
    });

    return {
      city,
      currentAverage: hourlyAverage,
      forecast,
    };
  }
}
