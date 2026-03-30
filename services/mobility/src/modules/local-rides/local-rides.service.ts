import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLocalRideRequestDto, CreateLocalOfferDto } from './dto/local-rides.dto';
import { GoogleMapsService } from '../../providers/google-maps/google-maps.service';

@Injectable()
export class LocalRidesService {
  private readonly logger = new Logger(LocalRidesService.name);

  constructor(
    private prisma: PrismaService,
    private googleMaps: GoogleMapsService,
  ) {}

  async createRideRequest(userId: string, dto: CreateLocalRideRequestDto) {
    let googleRoute;
    try {
      googleRoute = await this.googleMaps.computeRoute(
        { lat: dto.pickupLat, lng: dto.pickupLng },
        { lat: dto.dropoffLat, lng: dto.dropoffLng },
      );
    } catch (error) {
      this.logger.warn(`Failed to compute Google route, falling back to Haversine: ${error.message}`);
    }

    const distanceKm = googleRoute 
      ? googleRoute.distanceMeters / 1000 
      : this.calculateDistance(dto.pickupLat, dto.pickupLng, dto.dropoffLat, dto.dropoffLng);

    return this.prisma.localRideRequest.create({
      data: {
        rider_id: userId,
        pickup_address: dto.pickupAddress,
        dropoff_address: dto.dropoffAddress,
        pickup_lat: dto.pickupLat,
        pickup_lng: dto.pickupLng,
        dropoff_lat: dto.dropoffLat,
        dropoff_lng: dto.dropoffLng,
        distance_km: distanceKm,
        proposed_price: dto.proposedPrice,
        passenger_count: dto.passengerCount || 1,
        estimated_duration_seconds: googleRoute?.durationSeconds,
        polyline_points: googleRoute?.polyline,
      },
    });
  }

  async createOffer(driverId: string, dto: CreateLocalOfferDto) {
    return this.prisma.localRideOffer.create({
      data: {
        request_id: dto.requestId,
        driver_id: driverId,
        offer_price: dto.offerPrice,
        eta_minutes: dto.etaMinutes,
        status: 'pending',
      },
    });
  }

  async selectDriver(userId: string, requestId: string, offerId: string) {
    const offer = await this.prisma.localRideOffer.findUnique({
      where: { id: offerId },
      include: { request: true },
    });

    if (!offer || offer.request.rider_id !== userId) {
      throw new Error('Invalid offer or unauthorized');
    }

    return this.prisma.$transaction([
      this.prisma.localRideRequest.update({
        where: { id: requestId },
        data: { status: 'driver_selected' },
      }),
      this.prisma.localRide.create({
        data: {
          request_id: requestId,
          driver_id: offer.driver_id,
          final_price: offer.offer_price,
          otp_code: Math.floor(100000 + Math.random() * 900000).toString(),
        },
      }),
      this.prisma.localRideOffer.update({
        where: { id: offerId },
        data: { status: 'accepted' },
      }),
    ]);
  }

  calculateSuggestedPrice(distanceKm: number, durationSeconds?: number): { min: number; max: number; suggested: number } {
    const baseFare = 1.0;
    const ratePerKm = 0.5;
    const ratePerMin = 0.2; // Add traffic/time component
    
    let suggested = baseFare + distanceKm * ratePerKm;
    
    if (durationSeconds) {
      suggested += (durationSeconds / 60) * ratePerMin;
    }
    
    return {
      min: Math.max(baseFare, suggested * 0.8),
      max: suggested * 1.5,
      suggested: Math.round(suggested * 100) / 100,
    };
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}
