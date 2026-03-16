import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class SeatLockService implements OnModuleInit, OnModuleDestroy {
  private redisClient: Redis;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const redisUrl = this.configService.get<string>('REDIS_URL') || 'redis://localhost:6379';
    this.redisClient = new Redis(redisUrl);
  }

  onModuleDestroy() {
    this.redisClient.quit();
  }

  /**
   * Attempts to lock a seat for a user.
   * @param eventId The ID of the event
   * @param seatId The ID of the seat
   * @param userId The ID of the user requesting the lock
   * @param ttlSeconds Time to live for the lock (default 5 minutes)
   * @returns boolean True if lock was acquired, false otherwise
   */
  async lockSeat(eventId: string, seatId: string, userId: string, ttlSeconds: number = 300): Promise<boolean> {
    const lockKey = `seat_lock:${eventId}:${seatId}`;
    
    // NX: Only set if key doesn't exist
    // EX: Set expiration in seconds
    const result = await this.redisClient.set(lockKey, userId, 'EX', ttlSeconds, 'NX');
    
    return result === 'OK';
  }

  /**
   * Checks if a seat is currently locked.
   * @param eventId The ID of the event
   * @param seatId The ID of the seat
   * @returns string | null The user ID who holds the lock, or null
   */
  async getLockOwner(eventId: string, seatId: string): Promise<string | null> {
    const lockKey = `seat_lock:${eventId}:${seatId}`;
    return await this.redisClient.get(lockKey);
  }

  /**
   * Releases a lock manually.
   * @param eventId The ID of the event
   * @param seatId The ID of the seat
   */
  async releaseLock(eventId: string, seatId: string): Promise<void> {
    const lockKey = `seat_lock:${eventId}:${seatId}`;
    await this.redisClient.del(lockKey);
  }
}
