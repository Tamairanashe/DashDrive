import { Injectable, Logger, NotFoundException, Inject, forwardRef, Optional } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Rider, OrderStatus, DispatchAttemptStatus, DeliveryStatus } from '@prisma/client';
import { GeoService } from '../geo/geo.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { DispatchGateway } from './dispatch.gateway';

@Injectable()
export class DispatchService {
    private readonly logger = new Logger(DispatchService.name);

    constructor(
        private prisma: PrismaService,
        private geoService: GeoService,
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

    async processDispatch(deliveryId: string) {
        const delivery = await this.prisma.delivery.findUnique({
            where: { id: deliveryId },
            include: { dispatchAttempts: true, order: { include: { store: true } } }
        });

        if (!delivery || delivery.status !== DeliveryStatus.PENDING) return;

        const excludedRiders = delivery.dispatchAttempts.map((a: any) => a.riderId);

        let bestRider;
        try {
            bestRider = await this.findBestRider(delivery.orderId, excludedRiders);
        } catch (error) {
            this.logger.warn(`Dispatch failed for delivery ${deliveryId}: ${(error as Error).message}`);
            // Fallback strategy: trigger manual dispatch or wider retry
            return;
        }

        if (!bestRider) return;

        const attempt = await this.prisma.dispatchAttempt.create({
            data: {
                deliveryId,
                riderId: bestRider.id,
                status: DispatchAttemptStatus.PENDING
            }
        });

        const distanceKm = 2.4; // TODO: Real distance calculation from store to deliveryAddress
        const earnings = delivery.order.deliveryFee || 2.5;

        this.dispatchGateway.emitDeliveryRequest(bestRider.id, {
            attemptId: attempt.id,
            pickup: delivery.order.store.name,
            dropoff: delivery.order.deliveryAddress,
            distance: `${distanceKm} km`,
            estimatedEarnings: earnings
        });

        // 10 seconds timeout
        if (this.dispatchQueue) {
            await this.dispatchQueue.add('dispatch_timeout', { attemptId: attempt.id }, { delay: 10000 });
        }
    }

    async handleDispatchTimeout(attemptId: string) {
        const attempt = await this.prisma.dispatchAttempt.findUnique({ where: { id: attemptId } });
        if (!attempt || attempt.status !== DispatchAttemptStatus.PENDING) return;

        await this.prisma.dispatchAttempt.update({
            where: { id: attempt.id },
            data: { status: DispatchAttemptStatus.MISSED }
        });

        this.logger.log(`Dispatch attempt ${attemptId} missed. Requeuing for next rider.`);
        if (this.dispatchQueue) {
            await this.dispatchQueue.add('process_dispatch', { deliveryId: attempt.deliveryId });
        }
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
            await this.prisma.$transaction([
                this.prisma.dispatchAttempt.update({
                    where: { id: attempt.id },
                    data: { status: DispatchAttemptStatus.ACCEPTED }
                }),
                this.prisma.delivery.update({
                    where: { id: attempt.deliveryId },
                    data: { riderId, status: DeliveryStatus.ASSIGNED }
                }),
                this.prisma.order.update({
                    where: { id: attempt.delivery.orderId },
                    data: { status: OrderStatus.ASSIGNED_TO_RIDER }
                })
            ]);
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

    async findBestRider(orderId: string, excludedRiderIds: string[] = []): Promise<Rider> {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { store: { include: { merchant: { include: { country: true } } } } },
        });

        if (!order) throw new NotFoundException('Order not found');

        const countryCode = order.store.merchant.country.code;

        // Radius search using Redis GEO
        const nearbyRiderIds = await this.geoService.findNearbyRiders(
            0, // TODO: Store Lat
            0, // TODO: Store Lng
            5, // 5km radius
        );

        const availableRiders = await this.prisma.rider.findMany({
            where: {
                id: { in: nearbyRiderIds, notIn: excludedRiderIds },
                isOnline: true,
                isActive: true,
                countryCode,
            },
        });

        if (availableRiders.length === 0) {
            throw new Error('No riders available for dispatch in this region');
        }

        const scoredRiders = availableRiders.map((rider: any) => {
            const distanceScore = this.calculateDistanceScore(rider, { lat: 0, lng: 0 });
            const ratingScore = rider.rating * 2;
            const loadScore = Math.max(0, 10 - rider.currentLoad);
            const totalScore = distanceScore + ratingScore + loadScore;
            return { rider, score: totalScore };
        });

        scoredRiders.sort((a, b) => b.score - a.score);
        return scoredRiders[0].rider as Rider;
    }

    private calculateDistanceScore(
        rider: Rider,
        storeLocation: { lat: number; lng: number },
    ): number {
        if (!rider.latitude || !rider.longitude) return 0;
        return 10;
    }
}
