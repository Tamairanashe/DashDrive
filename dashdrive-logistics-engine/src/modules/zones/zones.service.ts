import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GeoService } from '../geo/geo.service';

@Injectable()
export class ZonesService {
    constructor(
        private prisma: PrismaService,
        private geoService: GeoService,
    ) { }

    async createZone(data: {
        name: string;
        countryCode: string;
        minLat: number;
        maxLat: number;
        minLng: number;
        maxLng: number;
        surgeMultiplier?: number;
    }) {
        return this.prisma.zone.create({
            data: {
                ...data,
                surgeMultiplier: data.surgeMultiplier || 1.0,
            },
        });
    }

    async getActiveZones(countryCode?: string) {
        return this.prisma.zone.findMany({
            where: {
                isActive: true,
                ...(countryCode ? { countryCode } : {}),
            },
        });
    }

    /**
     * Check which zone a point (lat/lng) belongs to
     * Simple rectangular bounding box for now
     */
    async findZoneAt(lat: number, lng: number) {
        const zones = await this.prisma.zone.findMany({
            where: { isActive: true },
        });

        return zones.find(
            (zone) =>
                lat >= zone.minLat &&
                lat <= zone.maxLat &&
                lng >= zone.minLng &&
                lng <= zone.maxLng,
        );
    }

    /**
     * Supply/Demand Ratio for a specific zone
     */
    async getZoneHeatmapMetrics(zoneId: string) {
        const zone = await this.prisma.zone.findUnique({
            where: { id: zoneId },
        });

        if (!zone) throw new NotFoundException('Zone not found');

        // Calculate center of zone
        const centerLat = (zone.minLat + zone.maxLat) / 2;
        const centerLng = (zone.minLng + zone.maxLng) / 2;

        // Use a conservative radius (approx city-wide or few km)
        const radiusKm = 5;

        // Supply: Active riders in zone
        const activeRiders = await this.geoService.countNearbyRiders(centerLat, centerLng, radiusKm);

        // Demand: Active orders in area (Simplified query for MVP)
        // In production, you'd filter by order coordinates or use a more precise geo-spatial order indexing
        const activeOrders = await this.prisma.order.count({
            where: {
                status: { in: ['PENDING', 'CONFIRMED', 'PREPARING', 'READY'] },
                // Filter orders by country code via store -> merchant -> country relation
                store: { merchant: { country: { code: zone.countryCode } } }
            },
        });

        const ratio = activeRiders > 0 ? activeOrders / activeRiders : activeOrders;

        return {
            zoneName: zone.name,
            activeRiders,
            activeOrders,
            supplyDemandRatio: ratio,
            surgeMultiplier: zone.surgeMultiplier,
            status: ratio > 2 ? 'HIGH_DEMAND' : ratio < 1 ? 'OVER_SUPPLY' : 'BALANCED',
        };
    }

    async setSurgeMultiplier(zoneId: string, multiplier: number) {
        return this.prisma.zone.update({
            where: { id: zoneId },
            data: { surgeMultiplier: multiplier },
        });
    }
}
