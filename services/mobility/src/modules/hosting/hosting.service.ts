import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class HostingService {
  constructor(private prisma: PrismaService) {}

  async setAvailability(vehicleId: string, data: {
    startDate: Date;
    endDate: Date;
    isAvailable: boolean;
    reason?: string;
  }) {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);

    if (start >= end) throw new BadRequestException('Start date must be before end date');

    // Remove overlapping availability records before creating new ones if we are blocking
    // For simplicity, we just create a new record. The check in TripsService will look for any isAvailable: false record.
    return this.prisma.vehicleAvailability.create({
      data: {
        vehicleId,
        startDate: start,
        endDate: end,
        isAvailable: data.isAvailable,
        reason: data.reason,
      },
    });
  }

  async getAvailability(vehicleId: string) {
    return this.prisma.vehicleAvailability.findMany({
      where: { vehicleId },
      orderBy: { startDate: 'asc' },
    });
  }

  async setPricingRule(vehicleId: string, data: {
    type: string;
    value: number;
    isPercentage: boolean;
  }) {
    return this.prisma.pricingRule.create({
      data: {
        vehicleId,
        type: data.type,
        value: new Prisma.Decimal(data.value),
        isPercentage: data.isPercentage,
      },
    });
  }

  async updateVehicleSettings(vehicleId: string, data: Prisma.VehicleUpdateInput) {
    return this.prisma.vehicle.update({
      where: { id: vehicleId },
      data,
    });
  }

  async getHostDashboard(hostId: string) {
    const vehicles = await this.prisma.vehicle.findMany({
      where: { hostId },
      include: {
        _count: { select: { trips: true } },
      },
    });

    const recentTrips = await this.prisma.trip.findMany({
      where: { hostId },
      orderBy: { created_at: 'desc' },
      take: 5,
      include: { vehicle: true, guest: { select: { email: true } } },
    });

    const earnings = await this.prisma.hostEarning.findMany({
      where: { hostProfile: { userId: hostId } },
    });

    const totalEarnings = earnings.reduce((sum, e) => sum + e.amount.toNumber(), 0);

    return {
      vehiclesCount: vehicles.length,
      totalTrips: vehicles.reduce((sum, v) => sum + v._count.trips, 0),
      totalEarnings,
      recentTrips,
    };
  }
}
