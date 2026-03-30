import { Module } from '@nestjs/common';
import { CityToCityService } from './city-to-city.service';
import { CityToCityController } from './city-to-city.controller';
import { CityToCityGateway } from './city-to-city.gateway';
import { PrismaModule } from '../../prisma/prisma.module';

import { GoogleMapsModule } from '../../providers/google-maps/google-maps.module';

@Module({
  imports: [PrismaModule, GoogleMapsModule],
  controllers: [CityToCityController],
  providers: [CityToCityService, CityToCityGateway],
  exports: [CityToCityService, CityToCityGateway],
})
export class CityToCityModule {}
