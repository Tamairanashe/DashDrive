import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GeoService } from '../geo/geo.service';
import { DispatchGateway } from './dispatch.gateway';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as h3 from 'h3-js';

@Injectable()
export class DispatchBrainService implements OnModuleInit {
    private readonly logger = new Logger(DispatchBrainService.name);
    private readonly H3_RESOLUTION = 7; // Approx 1.2km across
    private readonly MIN_RATIO_THRESHOLD = 0.5; // If Ratio (Drivers/Requests) < 0.5, we have a shortage.

    constructor(
        private prisma: PrismaService,
        private geoService: GeoService,
        private dispatchGateway: DispatchGateway,
    ) {}

    onModuleInit() {
        this.logger.log(`🚀 Dispatch Brain initialized at H3 Resolution ${this.H3_RESOLUTION}`);
    }

    /**
     * Periodically analyze the city-wide supply/demand balance.
     * Runs every 30 seconds as per Step 10 of the Global Dispatch Brain design.
     */
    @Cron(CronExpression.EVERY_30_SECONDS)
    async runCityOrchestration() {
        const stats = await this.analyzeCityGrid();
        await this.processNudges(stats);
    }

    /**
     * Analyzes all active zones (cells) with activity.
     */
    async analyzeCityGrid() {
        const activeRiderIds = await this.geoService.getActiveRiderIds();
        
        // In a massive scale system, we'd fetch actual lat/lng from Redis or store in cell format.
        // For now, we fetch minimal profile info to get coordinates.
        const riders = await this.prisma.rider.findMany({
            where: { id: { in: activeRiderIds } },
            select: { id: true, latitude: true, longitude: true }
        });

        const pendingOrders = await this.prisma.order.findMany({
            where: { status: 'PENDING' },
            select: { id: true, deliveryAddress: true, storeId: true, store: { select: { address: true } } }
        });
        
        // TODO: Orders need lat/lng in schema for perfect brain. 
        // For now, we'll assume store location or geocode the address.
        // Mocking some location data for the sake of the algorithm demonstration.
        
        const cellStats = new Map<string, { drivers: string[], requests: string[] }>();

        // 1. Map Riders to H3 Cells
        for (const rider of riders) {
            if (rider.latitude && rider.longitude) {
                const cell = h3.latLngToCell(rider.latitude, rider.longitude, this.H3_RESOLUTION);
                let stats = cellStats.get(cell);
                if (!stats) {
                    stats = { drivers: [], requests: [] };
                    cellStats.set(cell, stats);
                }
                stats.drivers.push(rider.id);
            }
        }

        // 2. Map Requests to H3 Cells (Simulation logic)
        for (const order of pendingOrders) {
            // In a real system, we'd have pickup_lat/lng on the order.
            // Mocking a location near Downtown Harare for demonstration
            const mockLat = -17.8248;
            const mockLng = 31.0530;
            const cell = h3.latLngToCell(mockLat, mockLng, this.H3_RESOLUTION);
            let stats = cellStats.get(cell);
            if (!stats) {
                stats = { drivers: [], requests: [] };
                cellStats.set(cell, stats);
            }
            stats.requests.push(order.id);
        }

        return cellStats;
    }

    /**
     * Sends nudges to drivers based on supply/demand ratios.
     */
    private async processNudges(cellStats: Map<string, { drivers: string[], requests: string[] }>) {
        for (const [cell, data] of cellStats.entries()) {
            const supply = data.drivers.length;
            const demand = data.requests.length;
            
            if (demand > 0) {
                const ratio = supply / demand;

                if (ratio < this.MIN_RATIO_THRESHOLD) {
                    this.logger.log(`⚠️ Shortage detected in cell ${cell}: Ratio ${ratio.toFixed(2)} (${supply} drivers / ${demand} requests)`);
                    
                    // Check if this cell is in a Launch Mode zone
                    // (Simplified check: look for any launch zone overlapping this cell)
                    // In a real system, we'd use h3.cellToLatLng(cell)
                    const [lat, lng] = h3.cellToLatLng(cell);
                    const launchZone = await (this.prisma.zone as any).findFirst({
                        where: {
                            isLaunchMode: true,
                            minLat: { lte: lat },
                            maxLat: { gte: lat },
                            minLng: { lte: lng },
                            maxLng: { gte: lng }
                        }
                    });

                    const message = launchZone 
                        ? `🚀 Exclusive Launch Zone: High demand in the Anchor District! Move here to secure founding driver bonuses.`
                        : `High demand nearby! Move toward more requests for higher earnings.`;

                    // Nudge idle drivers in NEIGHBORING cells
                    const neighbors = h3.gridDisk(cell, 2); 
                    for (const neighbor of neighbors) {
                        if (neighbor === cell) continue;
                        
                        const neighborData = cellStats.get(neighbor);
                        if (neighborData && neighborData.drivers.length > 0) {
                            for (const riderId of neighborData.drivers) {
                                this.dispatchGateway.server.to(`rider_${riderId}`).emit('demand_nudge', {
                                    message,
                                    cell: cell,
                                    type: launchZone ? 'LAUNCH_ZONE_DEMAND' : 'HIGH_DEMAND'
                                });
                            }
                        }
                    }
                }
            } else if (supply > 5) {
                this.logger.log(`ℹ️ Over-supply in cell ${cell}: ${supply} idle drivers.`);
                // Could nudge drivers to move AWAY or balance out
            }
        }
    }

    /**
     * External trigger to get status of a specific zone
     */
    async getZoneStatus(lat: number, lng: number) {
        const cell = h3.latLngToCell(lat, lng, this.H3_RESOLUTION);
        const stats = await this.analyzeCityGrid();
        const data = stats.get(cell) || { drivers: [], requests: [] };
        
        return {
            cellId: cell,
            driverCount: data.drivers.length,
            requestCount: data.requests.length,
            ratio: data.requests.length > 0 ? data.drivers.length / data.requests.length : Infinity
        };
    }
}
