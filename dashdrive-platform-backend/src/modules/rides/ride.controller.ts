import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { RideService } from './ride.service';

@Controller('rides')
export class RideController {
  constructor(private readonly rideService: RideService) {}

  @Get('service-types')
  getServiceTypes() {
    return this.rideService.getServiceTypes();
  }

  @Post('estimate')
  estimateFare(@Body() data: { serviceTypeId: string; pickupLat: number; pickupLng: number; dropoffLat: number; dropoffLng: number }) {
    return this.rideService.estimateFare(data);
  }

  @Post('request')
  requestRide(@Body() data: { userId: string; serviceTypeId: string; pickupLat: number; pickupLng: number; pickupAddress: string; dropoffLat: number; dropoffLng: number; dropoffAddress: string }) {
    return this.rideService.requestRide(data);
  }

  @Post(':id/complete')
  completeTrip(@Param('id') id: string) {
    return this.rideService.completeTrip(id);
  }
}
