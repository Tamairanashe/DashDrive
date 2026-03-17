import { Controller, Get, Post, Body, Patch, Param, Query } from '@nestjs/common';
import { TripsService } from './trips.service';

@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post()
  create(@Body() data: any) {
    return this.tripsService.createTrip(data);
  }

  @Get('my')
  getMyTrips(@Query('userId') userId: string, @Query('role') role: 'guest' | 'host') {
    return this.tripsService.getMyTrips(userId, role);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Body('notes') notes?: string,
  ) {
    return this.tripsService.updateTripStatus(id, status, notes);
  }
}
