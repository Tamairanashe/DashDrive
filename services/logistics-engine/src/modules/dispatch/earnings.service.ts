import { Injectable, Logger, Inject } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class EarningsService {
  private readonly logger = new Logger(EarningsService.name);
  private readonly TARGET_HOURLY_INCOME = 15.0; // Target $15/hr
  private readonly ROLLING_WINDOW_MS = 3600000; // 1 hour

  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  /**
   * Records a completed job's earnings for a driver.
   */
  async recordEarnings(riderId: string, amount: number) {
    const key = `rider:earnings:${riderId}`;
    const timestamp = Date.now();

    let earningsLog: { t: number; a: number }[] =
      (await this.cacheManager.get(key)) || [];

    // Add new entry
    earningsLog.push({ t: timestamp, a: amount });

    // Clean up old entries outside the window
    earningsLog = earningsLog.filter(
      (e) => e.t > timestamp - this.ROLLING_WINDOW_MS,
    );

    await this.cacheManager.set(key, earningsLog, this.ROLLING_WINDOW_MS);
  }

  /**
   * Calculates the rolling hourly income for a driver.
   */
  async getRollingHourlyIncome(riderId: string): Promise<number> {
    const key = `rider:earnings:${riderId}`;
    const earningsLog: { t: number; a: number }[] =
      (await this.cacheManager.get(key)) || [];

    const timestamp = Date.now();
    const validEarnings = earningsLog.filter(
      (e) => e.t > timestamp - this.ROLLING_WINDOW_MS,
    );

    const total = validEarnings.reduce((sum, e) => sum + e.a, 0);
    return Number(total.toFixed(2));
  }

  /**
   * Calculates a priority boost score based on earnings gap and idle time.
   * Score range: 0 (no boost) to 10 (maximum boost).
   */
  async getEarningsPriorityScore(
    riderId: string,
    idleMinutes: number,
  ): Promise<number> {
    const currentIncome = await this.getRollingHourlyIncome(riderId);

    // 1. Earnings Gap Boost
    let gapScore = 0;
    if (currentIncome < this.TARGET_HOURLY_INCOME) {
      const gap = this.TARGET_HOURLY_INCOME - currentIncome;
      gapScore = Math.min(5, (gap / this.TARGET_HOURLY_INCOME) * 5); // Max 5 points for gap
    }

    // 2. Idle Time Boost
    // Idle score increases linearly up to 15 mins (anti-starvation)
    const idleScore = Math.min(5, (idleMinutes / 15) * 5); // Max 5 points for idle

    const totalScore = gapScore + idleScore;

    this.logger.debug(
      `Rider ${riderId}: Income $${currentIncome}, Idle ${idleMinutes}m -> Score ${totalScore.toFixed(2)}`,
    );

    return Number(totalScore.toFixed(2));
  }

  /**
   * Calculate job efficiency (Earnings / TimeToComplete)
   */
  calculateJobEfficiency(earnings: number, estimatedTimeMin: number): number {
    if (estimatedTimeMin === 0) return 0;
    return earnings / estimatedTimeMin;
  }
}
