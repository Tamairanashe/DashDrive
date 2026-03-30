import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { RentalService } from './rental.service';

@Controller('rentals')
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  @Get('search')
  searchVehicles(@Query('city') city: string, @Query('category') category?: string) {
    return this.rentalService.searchVehicles(city, category);
  }

  @Post('book')
  bookVehicle(@Body() data: { userId: string; vehicleId: string; pickupLocation: string; dropoffLocation: string; pickupDate: string; dropoffDate: string; insuranceType?: string }) {
    return this.rentalService.bookVehicle(data);
  }

  @Post(':id/return')
  returnVehicle(@Param('id') id: string, @Body() data: { mileage: number; fuelLevel: number; damageNotes?: string }) {
    return this.rentalService.returnVehicle(id, data);
  }
}
