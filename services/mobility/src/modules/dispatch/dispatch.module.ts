import { Module } from '@nestjs/common';
import { DispatchService } from './dispatch.service';
import { DriverModesService } from './driver-modes.service';
import { DriverModesController } from './driver-modes.controller';

import { GoogleMapsModule } from '../../providers/google-maps/google-maps.module';

@Module({
  imports: [GoogleMapsModule],
  providers: [DispatchService, DriverModesService],
  controllers: [DriverModesController],
  exports: [DispatchService, DriverModesService],
})
export class DispatchModule {}
