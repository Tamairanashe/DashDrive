import {
  Injectable,
  Logger,
  NotFoundException,
  Inject,
  forwardRef,
  Optional,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  Rider,
  OrderStatus,
  DispatchAttemptStatus,
  DeliveryStatus,
} from '@prisma/client';
import { GeoService } from '../geo/geo.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { DispatchGateway } from './dispatch.gateway';
import { EarningsService } from './earnings.service';
import { GoogleMapsService } from '../../common/providers/google-maps/google-maps.service';

@Injectable()
export class DispatchService {
  private readonly logger = new Logger(DispatchService.name);

  constructor(
    private prisma: PrismaService,
    private geoService: GeoService,
    private earningsService: EarningsService,
    @Optional() @InjectQueue('dispatch_queue') private dispatchQueue: Queue,
    @Inject(forwardRef(() => DispatchGateway))
    private dispatchGateway: DispatchGateway,
    private googleMaps: GoogleMapsService,
  ) {}

  async startDispatchFlow(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) throw new NotFoundException('Order not found');

    // For DIRECT vertical, we try to batch
    if (order.pickupLat && order.pickupLng) {
      return this.batchAndDispatch(orderId);
    }

    let delivery = await this.prisma.delivery.findUnique({
      where: { orderId },
    });
    if (!delivery) {
      delivery = await this.prisma.delivery.create({
        data: { orderId, status: DeliveryStatus.PENDING },
      });
    }

    if (this.dispatchQueue) {
      await this.dispatchQueue.add('process_dispatch', {
        deliveryId: delivery.id,
      });
    } else {
      this.logger.warn(
        `[MOCK] Dispatch queue not available. Skipping job for delivery ${delivery.id}`,
      );
    }
    this.logger.log(
      `Dispatch flow started for order ${orderId}, delivery ${delivery.id}`,
    );
  }

  async batchAndDispatch(orderId: string) {
    // 1. Try to find nearby orders to batch with
    const candidateOrders = await this.prisma.order.findMany({
      where: {
        status: OrderStatus.READY,
        id: { not: orderId },
        delivery: null,
      },
    });

    const referenceOrder = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!referenceOrder || referenceOrder.pickupLat === null || referenceOrder.pickupLng === null) {
      return;
    }

    const nearby = candidateOrders.filter(o => {
      if (o.pickupLat === null || o.pickupLng === null) return false;
      const dist = this.haversineDistance(referenceOrder.pickupLat as number, referenceOrder.pickupLng as number, o.pickupLat, o.pickupLng);
      return dist <= 2; // 2km radius
    });

    if (nearby.length > 0) {
      const allOrderIds = [orderId, ...nearby.map(o => o.id)].slice(0, 3); // Max 3 in a batch
      this.logger.log(`📦 Batching ${allOrderIds.length} orders together.`);

      const batch = await (this.prisma as any).deliveryBatch.create({
        data: { status: 'PENDING' }
      });

      const deliveries = await Promise.all(allOrderIds.map(async (oid, idx) => {
        return this.prisma.delivery.create({
          data: {
            orderId: oid,
            status: DeliveryStatus.PENDING,
            batchId: batch.id,
            sequence: idx + 1,
            vertical: 'DIRECT'
          }
        });
      }));

      // Start dispatch for the first delivery in the batch (logic handles the whole batch)
      if (this.dispatchQueue) {
        await this.dispatchQueue.add('process_dispatch', { deliveryId: deliveries[0].id });
      }
      return;
    }

    // No batch possible, just start normal flow
    let delivery = await this.prisma.delivery.findUnique({ where: { orderId } });
    if (!delivery) {
      delivery = await this.prisma.delivery.create({
        data: { orderId, status: DeliveryStatus.PENDING, vertical: 'DIRECT' },
      });
    }
    if (this.dispatchQueue) {
      await this.dispatchQueue.add('process_dispatch', { deliveryId: delivery.id });
    }
  }

  private haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  async processDispatch(deliveryId: string, radius: number = 5) {
    const delivery = await (this.prisma.delivery as any).findUnique({
      where: { id: deliveryId },
      include: { 
        dispatchAttempts: true, 
        order: { include: { store: true } }, 
        batch: { include: { deliveries: { include: { order: true } } } } 
      },
    });

    if (!delivery || delivery.status !== DeliveryStatus.PENDING) return;

    // In a broadcast model, we exclude riders who have already REJECTED this specific delivery
    const excludedRiders = delivery.dispatchAttempts
      .filter((a: any) => a.status === DispatchAttemptStatus.REJECTED)
      .map((a: any) => a.riderId);

    let bestRiders: Rider[];
    try {
      bestRiders = await this.findBestRiders(
        delivery.orderId,
        excludedRiders,
        radius,
      );
    } catch (error) {
      this.logger.warn(
        `Dispatch discovery failed for delivery ${deliveryId} at ${radius}km: ${(error as Error).message}`,
      );
      // If we found zero riders, trigger radius expansion immediately if under limit
      if (radius < 15) {
        return this.processDispatch(deliveryId, radius + 5);
      }
      return;
    }

    if (bestRiders.length === 0) return;

    // Broadcast to TOP 5 drivers (or fewer if not available)
    const broadcastGroup = bestRiders.slice(0, 5);

    for (const rider of broadcastGroup) {
      // Create pending attempt for each broadcasted rider
      const attempt = await this.prisma.dispatchAttempt.create({
        data: {
          deliveryId,
          riderId: rider.id,
          status: DispatchAttemptStatus.PENDING,
        },
      });

      const distanceKm = 2.4;
      const earnings = delivery.order.deliveryFee || 2.5;

      const deliveryData = delivery.batchId ? {
        attemptId: attempt.id,
        batchId: delivery.batchId,
        stops: (delivery as any).batch.deliveries.sort((a: any, b: any) => (a.sequence || 0) - (b.sequence || 0)).map((d: any) => ({
          orderId: d.orderId,
          pickup: d.order.pickupAddress || d.order.store?.address,
          dropoff: d.order.deliveryAddress
        })),
        totalFee: (delivery as any).batch.deliveries.reduce((sum: number, d: any) => sum + (d.order.deliveryFee || 0), 0),
        distance: `${distanceKm} km`,
        vertical: 'DIRECT',
        instructions: 'Priority Broadcast (Batch)',
      } : {
        attemptId: attempt.id,
        deliveryId: delivery.id,
        orderId: delivery.orderId,
        pickup: (delivery.order as any).pickupAddress || delivery.order.store?.address,
        dropoff: delivery.order.deliveryAddress,
        fee: delivery.order.deliveryFee,
        distance: `${distanceKm} km`,
        estimatedEarnings: earnings,
        vertical: 'DIRECT',
        instructions: 'Priority Broadcast',
      };

      this.dispatchGateway.emitDeliveryRequest(rider.id, deliveryData);
    }

    // 10 seconds timeout for this BATCH
    if (this.dispatchQueue) {
      await this.dispatchQueue.add(
        'dispatch_timeout',
        { deliveryId, currentRadius: radius },
        { delay: 10000 },
      );
    }
  }

  async handleDispatchTimeout(data: {
    deliveryId: string;
    currentRadius: number;
  }) {
    const { deliveryId, currentRadius } = data;

    const delivery = await this.prisma.delivery.findUnique({
      where: { id: deliveryId },
      include: {
        dispatchAttempts: { where: { status: DispatchAttemptStatus.PENDING } },
      },
    });

    if (!delivery || delivery.status !== DeliveryStatus.PENDING) return;

    // Mark all current pending attempts as MISSED
    if (delivery.dispatchAttempts.length > 0) {
      await this.prisma.dispatchAttempt.updateMany({
        where: { id: { in: delivery.dispatchAttempts.map((a) => a.id) } },
        data: { status: DispatchAttemptStatus.MISSED },
      });
    }

    // Expand radius or retry the next best group
    const nextRadius = currentRadius < 15 ? currentRadius + 5 : currentRadius;
    this.logger.log(
      `Dispatch batch for delivery ${deliveryId} timed out. Retrying with radius ${nextRadius}km.`,
    );

    return this.processDispatch(deliveryId, nextRadius);
  }

  async handleRiderResponse(
    attemptId: string,
    riderId: string,
    accept: boolean,
  ) {
    const attempt = await this.prisma.dispatchAttempt.findUnique({
      where: { id: attemptId, riderId },
      include: { delivery: true },
    });

    if (!attempt || attempt.status !== DispatchAttemptStatus.PENDING) {
      this.logger.warn(
        `Invalid or expired attempt response for rider ${riderId}`,
      );
      return;
    }

    if (accept) {
      // Generate a 4-digit PIN for Step 14
      const pin = Math.floor(1000 + Math.random() * 9000).toString();

      if (attempt.delivery.batchId) {
        // Handle Batch Assignment
        const batch = await (this.prisma as any).deliveryBatch.findUnique({
          where: { id: attempt.delivery.batchId },
          include: { deliveries: true }
        });

        await this.prisma.$transaction([
          this.prisma.dispatchAttempt.update({
            where: { id: attempt.id },
            data: { status: DispatchAttemptStatus.ACCEPTED },
          }),
          (this.prisma as any).deliveryBatch.update({
            where: { id: attempt.delivery.batchId },
            data: {
              riderId,
              status: DeliveryStatus.ASSIGNED,
            }
          }),
          this.prisma.delivery.updateMany({
            where: { batchId: attempt.delivery.batchId },
            data: {
              riderId,
              status: DeliveryStatus.ASSIGNED,
              verificationPin: pin,
            }
          }),
          this.prisma.rider.update({
            where: { id: riderId },
            data: {
              currentLoad: { increment: batch.deliveries.length },
              rideCredits: { decrement: batch.deliveries.length },
              reservedCredits: { increment: batch.deliveries.length },
            },
          }),
        ]);

        this.dispatchGateway.emitBroadcast('job_taken', {
          batchId: attempt.delivery.batchId,
        });

        this.logger.log(`Batch ${attempt.delivery.batchId} accepted by rider ${riderId}`);
      } else {
        // Normal Single Assignment
        await this.prisma.$transaction([
          this.prisma.dispatchAttempt.update({
            where: { id: attempt.id },
            data: { status: DispatchAttemptStatus.ACCEPTED },
          }),
          (this.prisma.delivery as any).update({
            where: { id: attempt.deliveryId },
            data: {
              riderId,
              status: DeliveryStatus.ASSIGNED,
              verificationPin: pin,
            },
          }),
          (this.prisma.rider as any).update({
            where: { id: riderId },
            data: {
              currentLoad: { increment: 1 },
              rideCredits: { decrement: 1 },
              reservedCredits: { increment: 1 },
            },
          }),
        ]);

        this.dispatchGateway.emitBroadcast('job_taken', {
          deliveryId: attempt.deliveryId,
        });

        this.logger.log(`Delivery ${attempt.deliveryId} accepted by rider ${riderId}`);
      }
    } else {
      await this.prisma.dispatchAttempt.update({
        where: { id: attempt.id },
        data: { status: DispatchAttemptStatus.REJECTED },
      });
      this.logger.log(
        `Delivery ${attempt.deliveryId} rejected by rider ${riderId}`,
      );
      if (this.dispatchQueue) {
        await this.dispatchQueue.add('process_dispatch', {
          deliveryId: attempt.deliveryId,
        });
      }
    }
  }

  async findBestRiders(
    orderId: string,
    excludedRiderIds: string[] = [],
    radius: number = 5,
  ): Promise<Rider[]> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        store: { include: { merchant: { include: { country: true } } } },
      },
    });

    if (!order) throw new NotFoundException('Order not found');

    const countryCode = order.store.merchant.country.code;

    const pickupLat = (order as any).pickupLat ?? order.store.latitude;
    const pickupLng = (order as any).pickupLng ?? order.store.longitude;

    // 1. Check for Launch Mode in this Zone
    const activeZones = await this.prisma.zone.findMany({
      where: {
        isActive: true,
        minLat: { lte: pickupLat },
        maxLat: { gte: pickupLat },
        minLng: { lte: pickupLng },
        maxLng: { gte: pickupLng },
      },
    });

    const softLaunchZone = activeZones.find(
      (z) =>
        (z as any).launchPhase === 'SOFT_LAUNCH' && (z as any).isLaunchMode,
    );

    // Strict radius cap for Soft Launch (Anchor District focus)
    const effectiveRadius = softLaunchZone ? Math.min(radius, 3) : radius;

    // 2. Radius search using Redis GEO
    const nearbyRiderIds = await this.geoService.findNearbyRiders(
      pickupLat,
      pickupLng,
      effectiveRadius,
    );

    const availableRiders = await this.prisma.rider.findMany({
      where: {
        id: { in: nearbyRiderIds, notIn: excludedRiderIds },
        isOnline: true,
        isActive: true,
        countryCode,
        rideCredits: { gt: 0 },
      },
    });

    if (availableRiders.length === 0) {
      throw new Error('No riders available for dispatch in this region');
    }

    // 3. Pre-sort by Haversine for performance (only use Distance Matrix for top 10)
    const candidates = availableRiders.map(rider => ({
      rider,
      haversineDistance: this.geoService.calculateDistance(
        rider.latitude || 0,
        rider.longitude || 0,
        pickupLat,
        pickupLng,
      )
    })).sort((a, b) => a.haversineDistance - b.haversineDistance).slice(0, 10);

    let travelTimes: { riderId: string; durationSeconds: number }[] = [];
    try {
      const response = await this.googleMaps.computeDistanceMatrix(
        candidates.map(c => ({ lat: c.rider.latitude || 0, lng: c.rider.longitude || 0 })),
        [{ lat: pickupLat, lng: pickupLng }]
      );
      
      travelTimes = candidates.map((c, idx) => ({
        riderId: c.rider.id,
        durationSeconds: response.rows[idx].elements[0].duration?.value || (c.haversineDistance * 120) // Fallback: 2 mins per km
      }));
    } catch (error) {
      this.logger.error(`Distance Matrix failed: ${error.message}. Using Haversine fallback.`);
      travelTimes = candidates.map(c => ({
        riderId: c.rider.id,
        durationSeconds: c.haversineDistance * 120 // 2 mins per km
      }));
    }

    const scoredRiders = await Promise.all(
      candidates.map(async (candidate) => {
        const rider = candidate.rider;
        const travelTime = travelTimes.find(t => t.riderId === rider.id)?.durationSeconds || 0;
        
        // Duration-based score (Inverse of duration, max 10 points)
        // Assume 10 mins (600s) as "poor" and 0 mins as "perfect"
        const durationScore = Math.max(0, 10 - (travelTime / 60));

        const ratingScore = (rider as any).rating * 2; // Max 10 if rating is 5
        const loadScore = Math.max(0, 10 - (rider as any).currentLoad); // Max 10 if load is 0

        // Idle Time Calculation
        const lastActive = (rider as any).lastActiveAt ? new Date((rider as any).lastActiveAt).getTime() : Date.now();
        const idleMs = Date.now() - lastActive;
        const idleMinutes = Math.floor(idleMs / 60000);

        // Integrate Earnings Optimizer
        const earningsScore = await this.earningsService.getEarningsPriorityScore(
          rider.id,
          idleMinutes,
        );

        let totalScore = durationScore + ratingScore + loadScore + earningsScore;

        // Founding Driver Boost
        if (softLaunchZone && (rider as any).isFoundingDriver) {
          totalScore += 10;
        }

        return { rider, score: totalScore };
      }),
    );

    scoredRiders.sort((a, b) => b.score - a.score);
    return scoredRiders.map((item) => item.rider) as Rider[];
  }

  /**
   * Backward-compatible wrapper for single-rider discovery.
   */
  async findBestRider(
    orderId: string,
    excludedRiderIds: string[] = [],
  ): Promise<Rider> {
    const riders = await this.findBestRiders(orderId, excludedRiderIds);
    return riders[0];
  }
}
