import { Module } from '@nestjs/common';
import { CityToCityService } from './city-to-city.service';
import { CityToCityController } from './city-to-city.controller';
import { CityToCityGateway } from './city-to-city.gateway';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CityToCityController],
  providers: [CityToCityService, CityToCityGateway],
  exports: [CityToCityService, CityToCityGateway],
})
export class CityToCityModule {}
