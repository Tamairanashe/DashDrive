import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RideService {
  constructor(private prisma: PrismaService) {}

  // --- Service Types ---
  async getServiceTypes() {
    return [
      { id: 'st-1', name: 'economy', basePrice: 2.50, pricePerKm: 0.80, pricePerMin: 0.10, maxPassengers: 4, isActive: true },
      { id: 'st-2', name: 'comfort', basePrice: 4.00, pricePerKm: 1.20, pricePerMin: 0.15, maxPassengers: 4, isActive: true },
      { id: 'st-3', name: 'premium', basePrice: 8.00, pricePerKm: 2.00, pricePerMin: 0.25, maxPassengers: 4, isActive: true },
      { id: 'st-4', name: 'xl', basePrice: 5.00, pricePerKm: 1.50, pricePerMin: 0.20, maxPassengers: 6, isActive: true },
      { id: 'st-5', name: 'moto', basePrice: 1.50, pricePerKm: 0.50, pricePerMin: 0.08, maxPassengers: 1, isActive: true },
    ];
  }

  // --- Fare Estimation ---
  async estimateFare(data: {
    serviceTypeId: string;
    pickupLat: number; pickupLng: number;
    dropoffLat: number; dropoffLng: number;
  }) {
    const serviceTypes = await this.getServiceTypes();
    const sType = serviceTypes.find(s => s.id === data.serviceTypeId) || serviceTypes[0];
    const distKm = this.haversineDistance(data.pickupLat, data.pickupLng, data.dropoffLat, data.dropoffLng);
    const estMinutes = Math.ceil(distKm * 2.5);
    const fare = sType.basePrice + (distKm * sType.pricePerKm) + (estMinutes * sType.pricePerMin);
    return {
      serviceType: sType.name,
      distanceKm: Math.round(distKm * 10) / 10,
      estimatedMinutes: estMinutes,
      estimatedFare: Math.round(fare * 100) / 100,
      surgeMultiplier: 1.0,
    };
  }

  // --- Request Ride ---
  async requestRide(data: {
    userId: string;
    serviceTypeId: string;
    pickupLat: number; pickupLng: number; pickupAddress: string;
    dropoffLat: number; dropoffLng: number; dropoffAddress: string;
  }) {
    const estimate = await this.estimateFare(data);
    return {
      id: `ride-${Date.now()}`,
      userId: data.userId,
      status: 'SEARCHING',
      ...estimate,
      pickupAddress: data.pickupAddress,
      dropoffAddress: data.dropoffAddress,
      createdAt: new Date(),
    };
  }

  // --- Complete Trip ---
  async completeTrip(rideId: string) {
    return {
      id: rideId,
      status: 'COMPLETED',
      completedAt: new Date(),
    };
  }

  // --- Haversine helper ---
  private haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371;
    const dLat = this.deg2rad(lat2 - lat1);
    const dLng = this.deg2rad(lng2 - lng1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  private deg2rad(deg: number) { return deg * (Math.PI / 180); }
}
