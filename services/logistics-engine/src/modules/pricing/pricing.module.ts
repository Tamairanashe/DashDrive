import { Module } from '@nestjs/common';
import { PricingService } from './pricing.service';
import { PricingController } from './pricing.controller';
import { SurgeEngineService } from './surge.service';
import { DistanceCalculatorService } from './distance.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { GeoModule } from '../geo/geo.module';

@Module({
  imports: [PrismaModule, GeoModule],
  providers: [PricingService, SurgeEngineService, DistanceCalculatorService],
  controllers: [PricingController],
  exports: [PricingService, SurgeEngineService],
})
export class PricingModule {}
