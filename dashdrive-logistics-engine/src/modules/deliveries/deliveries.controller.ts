import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { DeliveriesService } from './deliveries.service';
import { ApiKeyAuthGuard } from '../auth/api-key-auth.guard';
import { PricingQuoteDto } from '../pricing/pricing.service';

@Controller('deliveries')
export class DeliveriesController {
  constructor(private deliveriesService: DeliveriesService) {}

  @Post('quote')
  @UseGuards(ApiKeyAuthGuard)
  async getQuote(@Body() body: PricingQuoteDto) {
    return this.deliveriesService.getQuote(body);
  }

  @Post()
  @UseGuards(ApiKeyAuthGuard)
  async createDelivery(@Req() req: any, @Body() body: any) {
    return this.deliveriesService.createDelivery(req.merchant, body);
  }

  @Get('public/:id')
  async getPublicStatus(@Param('id') id: string) {
    return this.deliveriesService.getPublicStatus(id);
  }

  @Get(':id')
  @UseGuards(ApiKeyAuthGuard)
  async getDeliveryStatus(@Req() req: any, @Param('id') id: string) {
    return this.deliveriesService.getDeliveryStatus(req.merchant, id);
  }

  @Post(':id/verify-pin')
  @UseGuards(ApiKeyAuthGuard)
  async verifyPin(
    @Param('id') id: string,
    @Body() body: { riderId: string; pin: string },
  ) {
    return this.deliveriesService.verifyPin(id, body.riderId, body.pin);
  }
}
