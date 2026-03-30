import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class GeoService implements OnModuleInit, OnModuleDestroy {
  private redis: Redis;
  private readonly RIDER_LOCATIONS_KEY = 'riders_locations';
  private readonly RIDER_STATUS_PREFIX = 'rider_status:'; // rider_status:{id}
  private readonly HEARTBEAT_TIMEOUT = 30; // 30 seconds

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const useMock = this.configService.get('USE_MOCK_REDIS') === 'true';
    if (useMock) {
      const RedisMock = require('ioredis-mock');
      this.redis = new RedisMock();
      console.warn('🚀 GeoService: Using ioredis-mock');
    } else {
      this.redis = new Redis({
        host: this.configService.get('REDIS_HOST', 'localhost'),
        port: this.configService.get('REDIS_PORT', 6379),
      });
    }
  }

  onModuleDestroy() {
    this.redis.disconnect();
  }

  /**
   * Update rider location in Redis GEO index and refresh heartbeat
   */
  async updateRiderLocation(
    riderId: string,
    latitude: number,
    longitude: number,
  ) {
    const pipeline = this.redis.pipeline();
    pipeline.geoadd(this.RIDER_LOCATIONS_KEY, longitude, latitude, riderId);
    // Refresh online status heartbeat
    pipeline.set(
      `${this.RIDER_STATUS_PREFIX}${riderId}`,
      'online',
      'EX',
      this.HEARTBEAT_TIMEOUT,
    );
    await pipeline.exec();
  }

  /**
   * Find nearby riders within a given radius (in KM)
   */
  async findNearbyRiders(
    latitude: number,
    longitude: number,
    radiusKm: number,
  ): Promise<string[]> {
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
  async countNearbyRiders(
    latitude: number,
    longitude: number,
    radiusKm: number,
  ): Promise<number> {
    const riders = await this.findNearbyRiders(latitude, longitude, radiusKm);
    return riders.length;
  }

  /**
   * Calculate straight-line distance (Haversine) between two coordinates in KM
   */
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Remove rider from location tracking (e.g., when they go offline)
   */
  async removeRiderLocation(riderId: string) {
    const pipeline = this.redis.pipeline();
    pipeline.zrem(this.RIDER_LOCATIONS_KEY, riderId);
    pipeline.del(`${this.RIDER_STATUS_PREFIX}${riderId}`);
    await pipeline.exec();
  }

  /**
   * Manually set rider status (e.g. from a login/logout event)
   */
  async setRiderStatus(riderId: string, isOnline: boolean) {
    if (isOnline) {
      await this.redis.set(
        `${this.RIDER_STATUS_PREFIX}${riderId}`,
        'online',
        'EX',
        this.HEARTBEAT_TIMEOUT,
      );
    } else {
      await this.removeRiderLocation(riderId);
    }
  }

  /**
   * Check if a rider is online based on Redis heartbeat
   */
  async isRiderOnline(riderId: string): Promise<boolean> {
    const status = await this.redis.get(
      `${this.RIDER_STATUS_PREFIX}${riderId}`,
    );
    return status === 'online';
  }

  /**
   * Get all currently online rider IDs (based on active GEO entries)
   * This is a heavy operation if there are millions of riders, but useful for the brain.
   */
  async getActiveRiderIds(): Promise<string[]> {
    return this.redis.zrange(this.RIDER_LOCATIONS_KEY, 0, -1);
  }
}
