import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { HotelService } from './hotel.service';

@Controller('hotels')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @Get('search')
  search(@Query('city') city: string, @Query('checkIn') checkIn: string, @Query('checkOut') checkOut: string, @Query('guests') guests: number) {
    return this.hotelService.searchHotels(city, checkIn, checkOut, guests);
  }

  @Get(':hotelId/rooms')
  getRoomTypes(@Param('hotelId') hotelId: string) {
    return this.hotelService.getRoomTypes(hotelId);
  }

  @Post('book')
  bookRoom(@Body() data: { userId: string; roomTypeId: string; checkIn: string; checkOut: string; guests: number }) {
    return this.hotelService.bookRoom(data);
  }

  @Post(':id/cancel')
  cancelBooking(@Param('id') id: string) {
    return this.hotelService.cancelBooking(id);
  }
}
