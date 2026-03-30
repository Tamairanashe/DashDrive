import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GeoService } from '../geo/geo.service';

@Injectable()
export class RidersService {
  constructor(
    private prisma: PrismaService,
    private geoService: GeoService,
  ) {}

  async create(data: {
    name: string;
    phone: string;
    vehicleType: string;
    countryCode: string;
    userId: string;
    email?: string;
  }) {
    return this.prisma.rider.upsert({
      where: { userId: data.userId },
      update: data,
      create: data,
    });
  }

  async setOnlineStatus(riderId: string, isOnline: boolean) {
    const rider = await this.prisma.rider.update({
      where: { id: riderId },
      data: { isOnline },
    });

    if (!isOnline) {
      await this.geoService.removeRiderLocation(riderId);
    }

    return rider;
  }

  async getAvailableRiders(countryCode: string) {
    return this.prisma.rider.findMany({
      where: {
        isOnline: true,
        isActive: true,
        countryCode,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.rider.findUnique({
      where: { id },
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.rider.findUnique({
      where: { userId },
    });
  }

  async updateLocation(
    riderId: string,
    location: { latitude: number; longitude: number },
  ) {
    // Update Redis for real-time geo-spatial queries (High frequency)
    await this.geoService.updateRiderLocation(
      riderId,
      location.latitude,
      location.longitude,
    );

    // Update PostgreSQL for profile/last-known-location (Lower frequency or every update)
    return this.prisma.rider.update({
      where: { id: riderId },
      data: location,
    });
  }

  async incrementLoad(riderId: string) {
    return this.prisma.rider.update({
      where: { id: riderId },
      data: {
        currentLoad: { increment: 1 },
        totalDeliveries: { increment: 1 },
      },
    });
  }

  async decrementLoad(riderId: string) {
    return this.prisma.rider.update({
      where: { id: riderId },
      data: {
        currentLoad: { decrement: 1 },
      },
    });
  }
}
