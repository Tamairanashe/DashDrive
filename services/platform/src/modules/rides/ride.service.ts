import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRideDto } from './dto/create-ride.dto';
import { RideStatus } from '@prisma/client';

import { RideTrackingGateway } from './ride-tracking.gateway';
import { DriverWalletService } from './driver-wallet.service';

@Injectable()
export class RideService {
  constructor(
    private prisma: PrismaService,
    private rideGateway: RideTrackingGateway,
    private driverWalletService: DriverWalletService,
  ) {}

  // --- Service Types ---
  async getServiceTypes() {
    return this.prisma.rideServiceType.findMany({
      where: { isActive: true },
    });
  }

  // --- Fare Estimation ---
  async estimateFare(data: {
    serviceTypeId: string;
    pickupLat: number; pickupLng: number;
    dropoffLat: number; dropoffLng: number;
  }) {
    const sType = await this.prisma.rideServiceType.findUnique({
      where: { id: data.serviceTypeId },
    });

    if (!sType) {
      throw new NotFoundException('Service type not found');
    }

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
  async requestRide(data: CreateRideDto) {
    const estimate = await this.estimateFare({
      serviceTypeId: data.serviceTypeId,
      pickupLat: data.pickupLat,
      pickupLng: data.pickupLng,
      dropoffLat: data.dropoffLat,
      dropoffLng: data.dropoffLng,
    });

    const rideRequest = await this.prisma.rideRequest.create({
      data: {
        userId: data.userId,
        serviceTypeId: data.serviceTypeId,
        pickupLat: data.pickupLat,
        pickupLng: data.pickupLng,
        pickupAddress: data.pickupAddress,
        dropoffLat: data.dropoffLat,
        dropoffLng: data.dropoffLng,
        dropoffAddress: data.dropoffAddress,
        estimatedDistance: estimate.distanceKm,
        estimatedDuration: estimate.estimatedMinutes,
        estimatedFare: estimate.estimatedFare,
        status: RideStatus.REQUESTED,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
      },
      include: {
        serviceType: true,
      },
    });

    // Trigger dispatch logic (asynchronously or as a side effect)
    this.dispatchRide(rideRequest.id).catch(err => {
      console.error(`Dispatch failed for ride ${rideRequest.id}:`, err);
    });

    return rideRequest;
  }

  async findNearbyDrivers(lat: number, lng: number, serviceTypeId: string, radiusKm: number = 5) {
    const onlineDrivers = await this.prisma.driverProfile.findMany({
      where: {
        is_online: true,
        verification_status: 'verified',
        vehicle_type: { not: null },
      },
    });

    const nearby = onlineDrivers.filter(driver => {
      if (driver.last_location_lat === null || driver.last_location_lng === null) return false;
      const distance = this.haversineDistance(lat, lng, driver.last_location_lat, driver.last_location_lng);
      return distance <= radiusKm;
    });

    console.log(`🔍 [RideService] Found ${nearby.length} candidate drivers within ${radiusKm}km of (${lat}, ${lng})`);

    // Filter out drivers without active bundle credits
    const withCredits: any[] = [];
    for (const driver of nearby) {
      const hasCredits = await this.driverWalletService.hasActiveCredits(driver.id);
      if (hasCredits) withCredits.push(driver);
    }

    console.log(`💳 [RideService] ${withCredits.length}/${nearby.length} drivers have active bundle credits`);
    return withCredits;
  }

  async dispatchRide(rideRequestId: string) {
    const ride = await this.prisma.rideRequest.findUnique({
      where: { id: rideRequestId },
      include: { serviceType: true }
    });

    if (!ride) {
      console.warn(`⚠️ [RideService] Dispatch aborted: Ride ${rideRequestId} not found`);
      return;
    }
    
    if (ride.status !== RideStatus.REQUESTED) {
      console.log(`ℹ️ [RideService] Dispatch skipped: Ride ${rideRequestId} status is ${ride.status}`);
      return;
    }

    await this.prisma.rideRequest.update({
      where: { id: rideRequestId },
      data: { status: RideStatus.SEARCHING }
    });

    const nearbyDrivers = await this.findNearbyDrivers(ride.pickupLat, ride.pickupLng, ride.serviceTypeId);

    if (nearbyDrivers.length === 0) {
      console.log(`🚫 [RideService] No drivers found for ride ${rideRequestId}. Setting status to NO_DRIVERS.`);
      await this.prisma.rideRequest.update({
        where: { id: rideRequestId },
        data: { status: RideStatus.NO_DRIVERS }
      });
      return;
    }

    // In a real system, we'd emit via RideTrackingGateway to candidate drivers.
    nearbyDrivers.forEach(driver => {
      this.rideGateway.emitRideOffer(driver.user_id, {
        rideRequestId,
        pickupAddress: ride.pickupAddress,
        dropoffAddress: ride.dropoffAddress,
        estimatedFare: ride.estimatedFare,
        serviceType: ride.serviceType.name,
      });
    });

    console.log(`📡 Ride offer sent to ${nearbyDrivers.length} drivers for ride ${rideRequestId}`);
  }

  async acceptRide(rideRequestId: string, driverId: string) {
    const ride = await this.prisma.rideRequest.findUnique({
      where: { id: rideRequestId }
    });

    if (!ride) {
      throw new Error(`Ride ${rideRequestId} not found`);
    }

    if (ride.status !== RideStatus.SEARCHING) {
      console.error(`❌ [RideService] Acceptance failed: Ride ${rideRequestId} is in status ${ride.status}, expected SEARCHING`);
      throw new Error(`Ride no longer available for acceptance (Status: ${ride.status})`);
    }

    return this.prisma.$transaction(async (tx) => {
      // Check driver has active bundle credits
      const hasCredits = await this.driverWalletService.hasActiveCredits(driverId);
      if (!hasCredits) {
        throw new Error('No active ride bundle. Purchase a bundle to accept rides.');
      }

      const updatedRide = await tx.rideRequest.update({
        where: { id: rideRequestId },
        data: { status: RideStatus.DRIVER_ASSIGNED }
      });

      const trip = await (tx as any).rideTrip.create({
        data: {
          rideRequestId,
          driverId,
        }
      });

      // Deduct 1 ride credit from driver's active bundle
      await this.driverWalletService.deductRideCredit(driverId);

      this.rideGateway.emitRideUpdate(rideRequestId, { status: RideStatus.DRIVER_ASSIGNED, driverId });

      return { ride: updatedRide, trip };
    });
  }

  // --- Complete Trip ---
  async completeTrip(rideRequestId: string) {
    const ride = await this.prisma.rideRequest.update({
      where: { id: rideRequestId },
      data: { status: RideStatus.COMPLETED },
    });

    this.rideGateway.emitRideUpdate(rideRequestId, { status: RideStatus.COMPLETED });

    return ride;
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
