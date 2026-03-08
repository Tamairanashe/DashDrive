import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class LocationCleanupService {
    private readonly logger = new Logger(LocationCleanupService.name);
    private readonly RETENTION_HOURS = 48;

    constructor(private prisma: PrismaService) {}

    /**
     * Periodically prune old GPS history to prevent database bloat.
     * Runs every day at midnight.
     */
    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async pruneOldLocations() {
        const threshold = new Date();
        threshold.setHours(threshold.getHours() - this.RETENTION_HOURS);

        this.logger.log(`🧹 Starting GPS History Cleanup (Retention: ${this.RETENTION_HOURS}h)`);
        
        try {
            const result = await (this.prisma as any).riderLocationHistory.deleteMany({
                where: {
                    timestamp: { lt: threshold }
                }
            });
            
            this.logger.log(`✅ Pruned ${result.count} old location records.`);
        } catch (error) {
            this.logger.error(`❌ GPS Cleanup failed: ${(error as Error).message}`);
        }
    }
}
