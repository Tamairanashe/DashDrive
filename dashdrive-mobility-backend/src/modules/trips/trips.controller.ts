import { Controller, Get, Post, Body, Patch, Param, Query } from '@nestjs/common';
import { TripsService } from './trips.service';
import { GoogleMapsService } from '../../providers/google-maps/google-maps.service';

@Controller('trips')
export class TripsController {
  constructor(
    private readonly tripsService: TripsService,
    private readonly googleMaps: GoogleMapsService,
  ) {}

  @Post('compute-route')
  computeRoute(
    @Body() data: {
      origin: { lat: number; lng: number };
      destination: { lat: number; lng: number };
      travelMode?: 'DRIVE' | 'BICYCLE' | 'WALK' | 'TWO_WHEELER';
      computeAlternativeRoutes?: boolean;
      avoidTolls?: boolean;
      avoidHighways?: boolean;
    },
  ) {
    return this.googleMaps.computeRoutesV2({
      origin: data.origin,
      destination: data.destination,
      travelMode: data.travelMode,
      computeAlternativeRoutes: data.computeAlternativeRoutes ?? true,
      avoidTolls: data.avoidTolls,
      avoidHighways: data.avoidHighways,
    });
  }

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

