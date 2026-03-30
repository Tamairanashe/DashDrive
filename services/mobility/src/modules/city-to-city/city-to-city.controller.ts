import { Controller, Post, Get, Body, Query, Param } from '@nestjs/common';
import { CityToCityService } from './city-to-city.service';
import { CreateCityRideDto } from './dto/create-ride.dto';
import { SubmitOfferDto } from './dto/submit-offer.dto';
import { CreateDriverTripDto } from './dto/create-driver-trip.dto';

@Controller('city-to-city')
export class CityToCityController {
  constructor(private readonly c2cService: CityToCityService) {}

  @Post('rides')
  createRide(@Body() dto: CreateCityRideDto) {
    return this.c2cService.createRide(dto);
  }

  @Get('rides/available')
  getAvailableRides(@Query('routeId') routeId: string) {
    return this.c2cService.findAvailableRides(routeId);
  }

  @Post('offers')
  submitOffer(@Body() dto: SubmitOfferDto) {
    return this.c2cService.createOffer(dto);
  }

  @Post('driver-trips')
  createDriverTrip(@Body() dto: CreateDriverTripDto) {
    return this.c2cService.createDriverTrip(dto);
  }

  @Get('driver-trips/available')
  getAvailableDriverTrips(
    @Query('routeId') routeId?: string,
    @Query('date') date?: string,
  ) {
    return this.c2cService.findAvailableDriverTrips(routeId, date);
  }

  @Post('driver-trips/:id/book')
  bookTrip(
    @Param('id') id: string,
    @Body('userId') userId: string,
    @Body('seatCount') seatCount: number,
  ) {
    return this.c2cService.bookDriverTrip(id, userId, seatCount);
  }
}
