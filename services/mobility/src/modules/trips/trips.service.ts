import { Injectable, BadRequestException, ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TripsService {
  constructor(private prisma: PrismaService) {}

  async createTrip(data: {
    vehicleId: string;
    guestId: string;
    startDate: Date;
    endDate: Date;
  }) {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);

    if (start >= end) throw new BadRequestException('Start date must be before end date');

    try {
      return await this.prisma.$transaction(async (tx) => {
        // 1. Availability Check (Existing bookings)
        const overlappingBookings = await tx.trip.findMany({
          where: {
            vehicleId: data.vehicleId,
            status: { in: ['requested', 'confirmed', 'active'] },
            OR: [
              { startDate: { lte: end }, endDate: { gte: start } },
            ],
          },
        });

        if (overlappingBookings.length > 0) {
          throw new ConflictException('Vehicle is already booked for these dates');
        }

        // 2. Availability Check (Calendar blocking)
        const calendarBlocks = await tx.vehicleAvailability.findMany({
          where: {
            vehicleId: data.vehicleId,
            isAvailable: false,
            OR: [
              { startDate: { lte: end }, endDate: { gte: start } },
            ],
          },
        });

        if (calendarBlocks.length > 0) {
          throw new ConflictException('Vehicle is unavailable on the selected dates');
        }

        // 3. Fetch vehicle & Apply Pricing Rules
        const vehicle = await tx.vehicle.findUnique({ 
          where: { id: data.vehicleId },
          include: { pricingRules: { where: { isActive: true } } }
        });
        if (!vehicle) throw new NotFoundException('Vehicle not found');

        const diffTime = Math.abs(end.getTime() - start.getTime());
        const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
        
        let dailyPrice = vehicle.pricePerDay.toNumber();
        let totalAmount = dailyPrice * days;

        // Apply dynamic pricing (e.g., weekly discount)
        if (days >= 7) {
          const weeklyDiscount = vehicle.pricingRules.find(r => r.type === 'weekly_discount');
          if (weeklyDiscount) {
            const discount = weeklyDiscount.isPercentage 
              ? (totalAmount * (weeklyDiscount.value.toNumber() / 100))
              : weeklyDiscount.value.toNumber();
            totalAmount -= discount;
          }
        }

        // 4. Create the trip
        return await tx.trip.create({
          data: {
            vehicleId: data.vehicleId,
            guestId: data.guestId,
            hostId: vehicle.hostId,
            startDate: start,
            endDate: end,
            totalAmount: new Prisma.Decimal(totalAmount),
            status: 'requested',
          },
        });
      });
    } catch (error) {
      if (error instanceof ConflictException || error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      console.error('Prisma Error in createTrip:', error);
      throw new InternalServerErrorException('Failed to create trip');
    }
  }

  async updateTripStatus(id: string, status: string, notes?: string) {
    const trip = await this.prisma.trip.update({
      where: { id },
      data: { 
        status,
        ...(notes && { damageNotes: notes })
      }
    });

    if (status === 'completed') {
      await this.handleTripCompletion(id);
    }

    return trip;
  }

  async handleTripCompletion(tripId: string) {
    const trip = await this.prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) return;

    // Generate earnings record (Host gets 80% for now)
    const hostAmount = trip.totalAmount.toNumber() * 0.8;
    const hostProfile = await this.prisma.hostProfile.findUnique({
      where: { userId: trip.hostId },
    });

    if (hostProfile) {
      await this.prisma.hostEarning.create({
        data: {
          hostProfileId: hostProfile.id,
          tripId: trip.id,
          amount: new Prisma.Decimal(hostAmount),
          type: 'booking',
          status: 'pending',
        },
      });
    }
  }

  async getMyTrips(userId: string, role: 'guest' | 'host') {
    return this.prisma.trip.findMany({
      where: role === 'guest' ? { guestId: userId } : { hostId: userId },
      include: {
        vehicle: true,
        guest: { select: { id: true, email: true } },
        host: { select: { id: true, email: true } }
      },
      orderBy: { created_at: 'desc' }
    });
  }
}
