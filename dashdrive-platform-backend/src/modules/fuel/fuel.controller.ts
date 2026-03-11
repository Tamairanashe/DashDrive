import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { FuelService } from './fuel.service';

@Controller('fuel')
export class FuelController {
  constructor(private readonly fuelService: FuelService) {}

  @Get('stations')
  nearbyStations(@Query('lat') lat: number, @Query('lng') lng: number, @Query('radius') radius?: number) {
    return this.fuelService.getNearbyStations(lat, lng, radius);
  }

  @Get('stations/:id/fuel-types')
  getStationFuelTypes(@Param('id') id: string) {
    return this.fuelService.getStationFuelTypes(id);
  }

  @Post('order')
  orderFuel(@Body() data: { userId: string; stationId: string; fuelTypeId: string; quantity: number; orderType: 'self' | 'delivery' }) {
    return this.fuelService.orderFuel(data);
  }
}
