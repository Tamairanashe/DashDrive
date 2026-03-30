import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { EventBookingService } from './event.service';

@Controller('events')
export class EventBookingController {
  constructor(private readonly eventService: EventBookingService) {}

  @Get()
  async listEvents() {
    return this.eventService.listEvents();
  }

  @Get(':id/seats')
  async getSeats(@Param('id') eventId: string) {
    return this.eventService.getEventSeats(eventId);
  }

  @Post(':id/lock-seat')
  async lockSeat(
    @Param('id') eventId: string,
    @Body() body: { seatId: string; userId: string },
  ) {
    return this.eventService.reserveSeat(eventId, body.seatId, body.userId);
  }

  @Post('confirm-booking')
  async confirmBooking(
    @Body() body: { reservationId: string; userId: string },
  ) {
    return this.eventService.confirmBooking(body.reservationId, body.userId);
  }
}
