import { Module } from '@nestjs/common';
import { DispatchService } from './dispatch.service';
import { DriverModesService } from './driver-modes.service';
import { DriverModesController } from './driver-modes.controller';

@Module({
  providers: [DispatchService, DriverModesService],
  controllers: [DriverModesController],
  exports: [DispatchService, DriverModesService],
})
export class DispatchModule {}
