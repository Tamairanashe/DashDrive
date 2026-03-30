import { Injectable, ConflictException, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateCityRideDto } from './dto/create-ride.dto';
import { SubmitOfferDto } from './dto/submit-offer.dto';
import { CreateDriverTripDto } from './dto/create-driver-trip.dto';
import { CityToCityGateway } from './city-to-city.gateway';
import { GoogleMapsService } from '../../providers/google-maps/google-maps.service';

@Injectable()
export class CityToCityService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => CityToCityGateway))
    private gateway: CityToCityGateway,
    private googleMaps: GoogleMapsService,
  ) {}

  private async syncRouteData(routeId: string) {
    const route = await this.prisma.cityRoute.findUnique({ where: { id: routeId } });
    // @ts-ignore
    if (!route || route.polylinePoints) return route;

    try {
      // Use origin and destination city names for Directions API
      const googleRoute = await this.googleMaps.computeRoute(
        route.originCity as any,
        route.destinationCity as any
      );

      return await this.prisma.cityRoute.update({
        where: { id: routeId },
        data: {
          distanceKm: new Prisma.Decimal(googleRoute.distanceMeters / 1000),
          // @ts-ignore
          estimatedDurationSeconds: googleRoute.durationSeconds,
          // @ts-ignore
          polylinePoints: googleRoute.polyline,
        },
      });
    } catch (error) {
      console.error(`Failed to sync city route ${routeId}:`, error.message);
      return route;
    }
  }

  // --- Passenger Negotiation Flow ---

  async createRide(dto: CreateCityRideDto) {
    const ride = await this.prisma.cityRide.create({
      data: {
        userId: dto.userId,
        routeId: dto.routeId,
        departureTime: new Date(dto.departureTime),
        passengerCount: dto.passengerCount,
        proposedPrice: dto.proposedPrice,
        status: 'pending',
      },
      include: { route: true },
    });

    // Smart Matching & Broadcasting
    this.gateway.broadcastNewRideRequest(dto.routeId, ride);
    
    return ride;
  }

  async findAvailableRides(routeId?: string) {
    return this.prisma.cityRide.findMany({
      where: {
        status: 'pending',
        ...(routeId && { routeId }),
      },
      include: {
        route: true,
      },
    });
  }

  async createOffer(dto: SubmitOfferDto) {
    const ride = await this.prisma.cityRide.findUnique({
      where: { id: dto.rideId },
    });

    if (!ride) {
      throw new NotFoundException('Ride request not found');
    }

    const offer = await this.prisma.rideOffer.create({
      data: {
        rideId: dto.rideId,
        driverId: dto.driverId,
        offerPrice: dto.offerPrice,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
        status: 'pending',
      },
    });

    // Real-time Notification to Passenger
    this.gateway.notifyPassengerNewOffer(dto.rideId, offer);

    return offer;
  }

  // --- Driver Marketplace Flow ---

  async createDriverTrip(dto: CreateDriverTripDto) {
    return this.prisma.driverTrip.create({
      data: {
        driverId: dto.driverId,
        routeId: dto.routeId,
        departureTime: new Date(dto.departureTime),
        pricePerSeat: dto.pricePerSeat,
        totalSeats: dto.totalSeats,
        availableSeats: dto.totalSeats,
        status: 'scheduled',
      },
    });
  }

  async findAvailableDriverTrips(fromCity?: string, toCity?: string, date?: string) {
    let routeId: string | undefined;
    
    if (fromCity && toCity) {
      const route = await this.prisma.cityRoute.findFirst({
        where: {
          originCity: { contains: fromCity, mode: 'insensitive' },
          destinationCity: { contains: toCity, mode: 'insensitive' },
        },
      });
      routeId = route?.id;
    }

    const trips = await this.prisma.driverTrip.findMany({
      where: {
        status: 'scheduled',
        availableSeats: { gt: 0 },
        ...(routeId && { routeId }),
        ...(date && { 
          departureTime: {
            gte: new Date(date),
            lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000)
          }
        }),
      },
      include: {
        route: true,
      },
    });

    // Sync route data for the found trips
    await Promise.all(
      trips.map((t: any) => this.syncRouteData(t.routeId))
    );

    // Production Scoring Logic: (1 / price) + available_seats
    return trips.sort((a: any, b: any) => {
      const scoreA = (1 / a.pricePerSeat.toNumber()) + a.availableSeats;
      const scoreB = (1 / b.pricePerSeat.toNumber()) + b.availableSeats;
      return scoreB - scoreA;
    });
  }

  async bookDriverTrip(tripId: string, userId: string, seatCount: number) {
    const trip = await this.prisma.driverTrip.findUnique({
      where: { id: tripId },
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    if (trip.availableSeats < seatCount) {
      throw new ConflictException('Not enough seats available');
    }

    const currentPricePerSeat = trip.pricePerSeat.toNumber();
    const totalPrice = currentPricePerSeat * seatCount;

    const booking = await this.prisma.$transaction(async (tx) => {
      // 1. Mark seats as reserved
      await tx.driverTrip.update({
        where: { id: tripId },
        data: {
          availableSeats: { decrement: seatCount },
          status: trip.availableSeats - seatCount === 0 ? 'full' : 'scheduled',
        },
      });

      // 2. Mock Escrow Reservation
      console.log(`[ESCROW] Marking $${totalPrice} as HELD for User ${userId}`);

      // 3. Create booking record
      return tx.driverTripBooking.create({
        data: {
          tripId,
          userId,
          seatCount,
          totalPrice,
          status: 'confirmed',
        },
      });
    });

    this.gateway.notifyTripUpdate(booking.id, 'BOOKING_CONFIRMED');
    return booking;
  }
}
