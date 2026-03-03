import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Rider } from '@prisma/client';
import { GeoService } from '../geo/geo.service';

@Injectable()
export class DispatchService {
    private readonly logger = new Logger(DispatchService.name);

    constructor(
        private prisma: PrismaService,
        private geoService: GeoService,
    ) { }

    /**
     * AI-based dispatch scoring algorithm to find the best rider for an order.
     * Considers distance, rating, and current workload.
     */
    async findBestRider(orderId: string): Promise<Rider> {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: {
                store: {
                    include: {
                        merchant: {
                            include: { country: true },
                        },
                    },
                },
            },
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        const countryCode = order.store.merchant.country.code;

        // 1. Find nearby riders via Redis
        // For MVP, we'll assume a 5km radius around a fixed point (0,0) or store coordinates if available
        const nearbyRiderIds = await this.geoService.findNearbyRiders(
            0, // Store Lat (Substitute with order/store lat in production)
            0, // Store Lng (Substitute with order/store lng in production)
            5, // 5km radius
        );

        // 2. Fetch available riders in the same country that are also nearby
        const availableRiders = await this.prisma.rider.findMany({
            where: {
                id: { in: nearbyRiderIds },
                isOnline: true,
                isActive: true,
                countryCode,
            },
        });

        if (availableRiders.length === 0) {
            throw new Error('No riders available for dispatch in this region');
        }

        // Scoring Algorithm: The higher the score, the better the match
        const scoredRiders = availableRiders.map((rider) => {
            // 1. Distance Score (Placeholder: 0-10)
            // Ideally, use Haversine formula or a Maps API to calculate actual distance
            const distanceScore = this.calculateDistanceScore(rider, {
                lat: 0, // Placeholder for store lat
                lng: 0, // Placeholder for store lng
            });

            // 2. Rating Score (0-10): Rating (1-5) weighted by 2
            const ratingScore = rider.rating * 2;

            // 3. Workload Score (0-10): Inverse of current load (assuming max load of 10 for penalty)
            const loadScore = Math.max(0, 10 - rider.currentLoad);

            // Total Score Calculation (Weights: Distance 40%, Rating 30%, Workload 30%)
            const totalScore = distanceScore + ratingScore + loadScore;

            this.logger.debug(
                `Rider ${rider.name} (ID: ${rider.id}) - Score: ${totalScore.toFixed(
                    2,
                )} [D: ${distanceScore}, R: ${ratingScore}, L: ${loadScore}]`,
            );

            return { rider, score: totalScore };
        });

        // Sort by descending score
        scoredRiders.sort((a, b) => b.score - a.score);

        const bestMatch = scoredRiders[0].rider;
        this.logger.log(
            `Best match for Order #${order.orderNumber}: ${bestMatch.name} (Score: ${scoredRiders[0].score.toFixed(2)})`,
        );

        return bestMatch;
    }

    private calculateDistanceScore(
        rider: Rider,
        storeLocation: { lat: number; lng: number },
    ): number {
        // For MVP, we use 10 if location is present, 0 otherwise.
        // In production, this would be: 10 * (1 / (distanceKm + 1))
        if (!rider.latitude || !rider.longitude) return 0;
        return 10;
    }
}
