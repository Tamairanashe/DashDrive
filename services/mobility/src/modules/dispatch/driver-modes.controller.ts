import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { DriverModesService } from './driver-modes.service';
import { CourierMode } from '@prisma/client';

@Controller('driver-modes')
export class DriverModesController {
  constructor(private driverModesService: DriverModesService) {}

  @Post(':id/mode')
  async setMode(@Param('id') id: string, @Body() body: { mode: CourierMode }) {
    return this.driverModesService.setMode(id, body.mode);
  }

  @Post(':id/status')
  async setStatus(@Param('id') id: string, @Body() body: { isOnline: boolean }) {
    return this.driverModesService.setOnlineStatus(id, body.isOnline);
  }

  @Get(':id/batching')
  async getBatching(@Param('id') id: string) {
    return this.driverModesService.getBatchingPotential(id);
  }
}
