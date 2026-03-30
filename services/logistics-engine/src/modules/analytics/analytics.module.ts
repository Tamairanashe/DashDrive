import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { PredictionService } from './prediction.service';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsConsumer } from './analytics.consumer';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AnalyticsController, AnalyticsConsumer],
  providers: [AnalyticsService, PredictionService],
  exports: [AnalyticsService, PredictionService],
})
export class AnalyticsModule {}
