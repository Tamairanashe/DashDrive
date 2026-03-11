import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { EventBookingService } from './event.service';

@Controller('events')
export class EventBookingController {
  constructor(private readonly eventService: EventBookingService) {}

  @Get()
  listEvents(@Query('category') category?: string) {
    return this.eventService.listEvents(category);
  }

  @Get(':id/tickets')
  getTicketTypes(@Param('id') id: string) {
    return this.eventService.getTicketTypes(id);
  }

  @Post('purchase')
  purchaseTicket(@Body() data: { userId: string; ticketTypeId: string; quantity: number }) {
    return this.eventService.purchaseTicket(data);
  }
}
