import { Module } from '@nestjs/common';
import { ZonesService } from './zones.service';
import { ZonesController } from './zones.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { GeoModule } from '../geo/geo.module';

@Module({
  imports: [PrismaModule, GeoModule],
  providers: [ZonesService],
  controllers: [ZonesController],
  exports: [ZonesService],
})
export class ZonesModule {}
