import { Injectable, Logger, NotFoundException, Inject, forwardRef, Optional } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Rider, OrderStatus, DispatchAttemptStatus, DeliveryStatus } from '@prisma/client';
import { GeoService } from '../geo/geo.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { DispatchGateway } from './dispatch.gateway';
import { EarningsService } from './earnings.service';

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
    ) { }

    async startDispatchFlow(orderId: string) {
        const order = await this.prisma.order.findUnique({ where: { id: orderId } });
        if (!order) throw new NotFoundException('Order not found');

        let delivery = await this.prisma.delivery.findUnique({ where: { orderId } });
        if (!delivery) {
            delivery = await this.prisma.delivery.create({
                data: { orderId, status: DeliveryStatus.PENDING }
            });
        }

        if (this.dispatchQueue) {
            await this.dispatchQueue.add('process_dispatch', { deliveryId: delivery.id });
        } else {
            this.logger.warn(`[MOCK] Dispatch queue not available. Skipping job for delivery ${delivery.id}`);
        }
        this.logger.log(`Dispatch flow started for order ${orderId}, delivery ${delivery.id}`);
    }

    async processDispatch(deliveryId: string, radius: number = 5) {
        const delivery = await this.prisma.delivery.findUnique({
            where: { id: deliveryId },
            include: { dispatchAttempts: true, order: { include: { store: true } } }
        });

        if (!delivery || delivery.status !== DeliveryStatus.PENDING) return;

        // In a broadcast model, we exclude riders who have already REJECTED this specific delivery
        const excludedRiders = delivery.dispatchAttempts
            .filter((a: any) => a.status === DispatchAttemptStatus.REJECTED)
            .map((a: any) => a.riderId);

        let bestRiders: Rider[];
        try {
            bestRiders = await this.findBestRiders(delivery.orderId, excludedRiders, radius);
        } catch (error) {
            this.logger.warn(`Dispatch discovery failed for delivery ${deliveryId} at ${radius}km: ${(error as Error).message}`);
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
                    status: DispatchAttemptStatus.PENDING
                }
            });

            const distanceKm = 2.4; 
            const earnings = delivery.order.deliveryFee || 2.5;

            this.dispatchGateway.emitDeliveryRequest(rider.id, {
                attemptId: attempt.id,
                pickup: delivery.order.store.name,
                dropoff: delivery.order.deliveryAddress,
                distance: `${distanceKm} km`,
                estimatedEarnings: earnings,
                vertical: 'DIRECT',
                instructions: 'Priority Broadcast'
            });
        }

        // 10 seconds timeout for this BATCH
        if (this.dispatchQueue) {
            await this.dispatchQueue.add('dispatch_timeout', 
                { deliveryId, currentRadius: radius }, 
                { delay: 10000 }
            );
        }
    }

    async handleDispatchTimeout(data: { deliveryId: string, currentRadius: number }) {
        const { deliveryId, currentRadius } = data;
        
        const delivery = await this.prisma.delivery.findUnique({ 
            where: { id: deliveryId },
            include: { dispatchAttempts: { where: { status: DispatchAttemptStatus.PENDING } } }
        });

        if (!delivery || delivery.status !== DeliveryStatus.PENDING) return;

        // Mark all current pending attempts as MISSED
        if (delivery.dispatchAttempts.length > 0) {
            await this.prisma.dispatchAttempt.updateMany({
                where: { id: { in: delivery.dispatchAttempts.map(a => a.id) } },
                data: { status: DispatchAttemptStatus.MISSED }
            });
        }

        // Expand radius or retry the next best group
        const nextRadius = currentRadius < 15 ? currentRadius + 5 : currentRadius;
        this.logger.log(`Dispatch batch for delivery ${deliveryId} timed out. Retrying with radius ${nextRadius}km.`);
        
        return this.processDispatch(deliveryId, nextRadius);
    }

    async handleRiderResponse(attemptId: string, riderId: string, accept: boolean) {
        const attempt = await this.prisma.dispatchAttempt.findUnique({
            where: { id: attemptId, riderId },
            include: { delivery: true }
        });

        if (!attempt || attempt.status !== DispatchAttemptStatus.PENDING) {
            this.logger.warn(`Invalid or expired attempt response for rider ${riderId}`);
            return;
        }

        if (accept) {
            // Generate a 4-digit PIN for Step 14
            const pin = Math.floor(1000 + Math.random() * 9000).toString();

            await this.prisma.$transaction([
                this.prisma.dispatchAttempt.update({
                    where: { id: attempt.id },
                    data: { status: DispatchAttemptStatus.ACCEPTED }
                }),
                (this.prisma.delivery as any).update({
                    where: { id: attempt.deliveryId },
                    data: { 
                        riderId, 
                        status: DeliveryStatus.ASSIGNED,
                        verificationPin: pin
                    }
                }),
                (this.prisma.rider as any).update({
                    where: { id: riderId },
                    data: { 
                        currentLoad: { increment: 1 },
                        rideCredits: { decrement: 1 },
                        reservedCredits: { increment: 1 }
                    }
                })
            ]);

            // Notify other potential riders that the job is taken
            this.dispatchGateway.emitBroadcast('job_taken', { deliveryId: attempt.deliveryId });
            
            this.logger.log(`Delivery ${attempt.deliveryId} accepted by rider ${riderId}`);
        } else {
            await this.prisma.dispatchAttempt.update({
                where: { id: attempt.id },
                data: { status: DispatchAttemptStatus.REJECTED }
            });
            this.logger.log(`Delivery ${attempt.deliveryId} rejected by rider ${riderId}`);
            if (this.dispatchQueue) {
                await this.dispatchQueue.add('process_dispatch', { deliveryId: attempt.deliveryId });
            }
        }
    }

    async findBestRiders(orderId: string, excludedRiderIds: string[] = [], radius: number = 5): Promise<Rider[]> {
        const order = (await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { store: { include: { merchant: { include: { country: true } } } } },
        })) as any;

        if (!order) throw new NotFoundException('Order not found');

        const countryCode = order.store.merchant.country.code;

        const storeLat = order.store.latitude || -17.8248; 
        const storeLng = order.store.longitude || 31.0530;

        // 1. Check for Launch Mode in this Zone
        const activeZones = await this.prisma.zone.findMany({
            where: {
                isActive: true,
                minLat: { lte: storeLat },
                maxLat: { gte: storeLat },
                minLng: { lte: storeLng },
                maxLng: { gte: storeLng }
            }
        });

        const softLaunchZone = activeZones.find(z => (z as any).launchPhase === 'SOFT_LAUNCH' && (z as any).isLaunchMode);
        
        // Strict radius cap for Soft Launch (Anchor District focus)
        const effectiveRadius = softLaunchZone ? Math.min(radius, 3) : radius;

        // 2. Radius search using Redis GEO
        const nearbyRiderIds = await this.geoService.findNearbyRiders(
            storeLat,
            storeLng,
            effectiveRadius,
        );

        const availableRiders = await (this.prisma.rider as any).findMany({
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

        const scoredRiders = await Promise.all(availableRiders.map(async (rider: any) => {
            const distance = this.geoService.calculateDistance(
                rider.latitude || 0,
                rider.longitude || 0,
                storeLat,
                storeLng
            );
            
            // Distance Score (Inverse of distance, max 10 points)
            const distanceScore = Math.max(0, 10 - distance); 
            
            const ratingScore = rider.rating * 2; // Max 10 if rating is 5
            const loadScore = Math.max(0, 10 - rider.currentLoad); // Max 10 if load is 0
            
            // Idle Time Calculation
            const idleMs = Date.now() - new Date(rider.lastActiveAt).getTime();
            const idleMinutes = Math.floor(idleMs / 60000);

            // Integrate Earnings Optimizer (includes earnings gap + idle boost)
            const earningsScore = await this.earningsService.getEarningsPriorityScore(
                rider.id,
                idleMinutes
            );

            // Total Score is a blend of operational efficiency and driver fairness
            let totalScore = distanceScore + ratingScore + loadScore + earningsScore;
            
            // 3. Founding Driver Boost (Priority during Soft Launch)
            if (softLaunchZone && rider.isFoundingDriver) {
                totalScore += 10; // Significant boost to reward loyalty
                this.logger.debug(`Boosting founding rider ${rider.id} in soft launch zone`);
            }

            return { rider, score: totalScore };
        }));

        scoredRiders.sort((a, b) => b.score - a.score);
        return scoredRiders.map(item => item.rider) as Rider[];
    }

    /**
     * Backward-compatible wrapper for single-rider discovery.
     */
    async findBestRider(orderId: string, excludedRiderIds: string[] = []): Promise<Rider> {
        const riders = await this.findBestRiders(orderId, excludedRiderIds);
        return riders[0];
    }

}
