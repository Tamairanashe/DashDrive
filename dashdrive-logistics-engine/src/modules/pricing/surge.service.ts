import { Injectable, Logger, Inject } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GeoService } from '../geo/geo.service';
import { DeliveryStatus } from '@prisma/client';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class SurgeEngineService {
    private readonly logger = new Logger(SurgeEngineService.name);

    constructor(
        private prisma: PrismaService,
        private geoService: GeoService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) { }

    /**
     * Calculates the dynamic surge multiplier for a given pickup location.
     * Formula: Active Deliveries in Radius / Available Riders in Radius
     */
    async calculateDemandMultiplier(lat: number, lng: number, radiusKm: number = 5): Promise<number> {
        const cacheKey = `surge:multiplier:${lat.toFixed(2)}:${lng.toFixed(2)}`;
        const cachedSurge = await this.cacheManager.get<number>(cacheKey);

        if (cachedSurge) {
            return cachedSurge;
        }

        // 1. Check if location falls into a predefined manual SurgeZone
        const manualSurge = await this.checkManualSurgeZones(lat, lng);
        if (manualSurge > 1.0) {
            // Keep the manual surge for a bit
            await this.cacheManager.set(cacheKey, manualSurge, 60000); // 1 minute
            return manualSurge;
        }

        // 2. Algorithm Dynamic Surge Calculation
        try {
            const availableRidersCount = await this.geoService.countNearbyRiders(lat, lng, radiusKm);

            // Fetch active deliveries (PENDING, ASSIGNED, PICKED_UP) within the same rough area, or overall.
            // For MVP: Count all non-delivered active deliveries in the system (or tied to stores nearby).
            // A more production-ready approach would do a PostGIS query or another Redis Geo index just for active orders.
            const activeDeliveriesCount = await this.prisma.delivery.count({
                where: {
                    status: {
                        in: [DeliveryStatus.PENDING, DeliveryStatus.ASSIGNED, DeliveryStatus.PICKED_UP]
                    }
                }
            });

            const demandRatio = availableRidersCount > 0
                ? activeDeliveriesCount / availableRidersCount
                : 2.0; // High demand if 0 riders

            let dynamicMultiplier = 1.0;

            if (demandRatio > 2.0) {
                dynamicMultiplier = 1.5; // High demand
            } else if (demandRatio > 1.2) {
                dynamicMultiplier = 1.2; // Medium demand
            }

            this.logger.debug(`Demand Ratio: ${demandRatio.toFixed(2)} | Multiplier: ${dynamicMultiplier}`);

            // Cache for 1 minute to prevent DB/Redis hammering during real surges
            await this.cacheManager.set(cacheKey, dynamicMultiplier, 60000);
            return dynamicMultiplier;

        } catch (error) {
            this.logger.error(`Failed to calculate surge: ${(error as Error).message}`);
            return 1.0; // Safe fallback
        }
    }

    private async checkManualSurgeZones(lat: number, lng: number): Promise<number> {
        // Fetch all active surge zones. In real world, filter via PostGIS ST_Distance
        const zones = await this.prisma.surgeZone.findMany({
            where: { active: true }
        });

        for (const zone of zones) {
            const distance = this.calculateHaversine(lat, lng, zone.centerLat, zone.centerLng);
            if (distance <= zone.radiusKm) {
                return zone.multiplier;
            }
        }
        return 1.0;
    }

    private calculateHaversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
        const R = 6371; // km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            0.5 - Math.cos(dLat) / 2 +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            (1 - Math.cos(dLon)) / 2;

        return R * 2 * Math.asin(Math.sqrt(a));
    }
}
