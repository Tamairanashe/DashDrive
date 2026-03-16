import { Module, Global, forwardRef } from '@nestjs/common';
import { DispatchService } from './dispatch.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { BullModule } from '@nestjs/bullmq';
import { DispatchProcessor } from './dispatch.processor';
import { DispatchGateway } from './dispatch.gateway';
import { RoutingService } from './routing.service';
import { RoutingController } from './routing.controller';
import { EarningsService } from './earnings.service';
import { DispatchBrainService } from './dispatch-brain.service';
import { GeoModule } from '../geo/geo.module';
import { LocationCleanupService } from './location-cleanup.service';

const useMockRedis = process.env.USE_MOCK_REDIS === 'true';

@Global()
@Module({
  imports: [
    PrismaModule,
    GeoModule,
    ...(useMockRedis
      ? []
      : [BullModule.registerQueue({ name: 'dispatch_queue' })]),
  ],
  controllers: [RoutingController],
  providers: [
    DispatchService,
    DispatchGateway,
    RoutingService,
    EarningsService,
    DispatchBrainService,
    LocationCleanupService,
    ...(useMockRedis ? [] : [DispatchProcessor]),
  ],
  exports: [
    DispatchService,
    RoutingService,
    EarningsService,
    DispatchBrainService,
  ],
})
export class DispatchModule {}
