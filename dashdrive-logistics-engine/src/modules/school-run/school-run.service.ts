import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DeliveriesService } from '../deliveries/deliveries.service';

@Injectable()
export class SchoolRunService {
  private readonly logger = new Logger(SchoolRunService.name);

  constructor(
    private prisma: PrismaService,
    private deliveriesService: DeliveriesService,
  ) {}

  async createSubscription(data: any) {
    return this.prisma.schoolRunSubscription.create({
      data: {
        studentId: data.studentId,
        parentId: data.parentId,
        schoolId: data.schoolId,
        pickupTime: data.pickupTime,
        dropoffTime: data.dropoffTime,
        daysOfWeek: data.daysOfWeek,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
      },
    });
  }

  async getSubscriptions(parentId: string) {
    return this.prisma.schoolRunSubscription.findMany({
      where: { parentId },
    });
  }

  // This method would be called by a cron job every morning
  async generateDailyDeliveries() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0-6 (Sunday-Saturday)

    const activeSubscriptions =
      await this.prisma.schoolRunSubscription.findMany({
        where: {
          status: 'ACTIVE',
          daysOfWeek: { has: dayOfWeek },
          startDate: { lte: today },
          OR: [{ endDate: null }, { endDate: { gte: today } }],
        },
      });

    for (const sub of activeSubscriptions) {
      try {
        // Logic to create a delivery for this subscription
        // We'll need more details about pickup/dropoff addresses from student/school
        // For now, logging the intent
        this.logger.log(`Generating delivery for subscription ${sub.id}`);

        // In a real implementation, we would call platform-backend to get address details
        // or have them cached/stored in logistics engine.
      } catch (error) {
        this.logger.error(
          `Failed to generate delivery for subscription ${sub.id}`,
          error,
        );
      }
    }
  }
}
