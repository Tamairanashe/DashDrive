import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TripsService } from '../trips/trips.service';

@Injectable()
export class InspectionsService {
  constructor(
    private prisma: PrismaService,
    private tripsService: TripsService,
  ) {}

  async createInspection(tripId: string, data: {
    type: string;
    odometerReading: number;
    fuelLevel: number;
    photos: string[];
    notes?: string;
  }) {
    const trip = await this.prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) throw new NotFoundException('Trip not found');

    // Update trip status using TripsService to trigger side effects (earnings, etc.)
    if (data.type === 'check_in') {
      await this.tripsService.updateTripStatus(tripId, 'active');
    } else if (data.type === 'check_out') {
      await this.tripsService.updateTripStatus(tripId, 'completed');
    }

    return this.prisma.tripInspection.create({
      data: {
        tripId,
        type: data.type,
        odometerReading: data.odometerReading,
        fuelLevel: data.fuelLevel,
        photos: data.photos,
        notes: data.notes,
      },
    });
  }

  async getTripInspections(tripId: string) {
    return this.prisma.tripInspection.findMany({
      where: { tripId },
      orderBy: { created_at: 'asc' },
    });
  }
}
