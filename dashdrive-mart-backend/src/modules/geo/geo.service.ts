import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class GeoService implements OnModuleInit, OnModuleDestroy {
    private redis: Redis;
    private readonly RIDER_LOCATIONS_KEY = 'riders_locations';

    constructor(private configService: ConfigService) { }

    onModuleInit() {
        this.redis = new Redis({
            host: this.configService.get('REDIS_HOST', 'localhost'),
            port: this.configService.get('REDIS_PORT', 6379),
        });
    }

    onModuleDestroy() {
        this.redis.disconnect();
    }

    /**
     * Update rider location in Redis GEO index
     */
    async updateRiderLocation(riderId: string, latitude: number, longitude: number) {
        await this.redis.geoadd(this.RIDER_LOCATIONS_KEY, longitude, latitude, riderId);
    }

    /**
     * Find nearby riders within a given radius (in KM)
     */
    async findNearbyRiders(latitude: number, longitude: number, radiusKm: number): Promise<string[]> {
        const results = await this.redis.georadius(
            this.RIDER_LOCATIONS_KEY,
            longitude,
            latitude,
            radiusKm,
            'km',
        );
        return results as string[];
    }

    /**
     * Get total number of active riders in a circular area
     */
    async countNearbyRiders(latitude: number, longitude: number, radiusKm: number): Promise<number> {
        const riders = await this.findNearbyRiders(latitude, longitude, radiusKm);
        return riders.length;
    }

    /**
     * Remove rider from location tracking (e.g., when they go offline)
     */
    async removeRiderLocation(riderId: string) {
        await this.redis.zrem(this.RIDER_LOCATIONS_KEY, riderId);
    }
}
