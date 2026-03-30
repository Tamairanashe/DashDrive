import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CourierMode } from '@prisma/client';

@Injectable()
export class DriverModesService {
  private readonly logger = new Logger(DriverModesService.name);

  constructor(private prisma: PrismaService) {}

  async setMode(driverId: string, mode: CourierMode) {
    this.logger.log(`Setting driver ${driverId} mode to ${mode}`);
    return this.prisma.driverProfile.update({
      where: { id: driverId },
      data: { current_mode: mode },
    });
  }

  async setOnlineStatus(driverId: string, isOnline: boolean) {
    return this.prisma.driverProfile.update({
      where: { id: driverId },
      data: { is_online: isOnline },
    });
  }

  async getBatchingPotential(driverId: string) {
    // Logic to check if driver is on a route that can accept more orders
    // This would check active deliveries for this driver
    const activeDeliveries = await this.prisma.delivery.findMany({
      where: {
        courier_id: driverId,
        status: { in: ['assigned', 'picked_up'] }
      }
    });

    return {
      currentCount: activeDeliveries.length,
      canAcceptMore: activeDeliveries.length < 3 // Global limit of 3 for batching
    };
  }
}
