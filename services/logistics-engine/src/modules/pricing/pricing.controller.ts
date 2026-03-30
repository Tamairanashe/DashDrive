import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PricingService } from './pricing.service';
import { PricingQuoteDto } from './pricing.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('pricing')
@Controller('pricing')
@ApiBearerAuth()
// @UseGuards(JwtAuthGuard) // In a real scenario, this would be guarded by an API Key or JWT depending on if it's B2B or B2C
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Post('quote')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request a dynamic delivery price quote' })
  async getQuote(@Body() dto: PricingQuoteDto) {
    return this.pricingService.getDeliveryQuote(dto);
  }

  @Post('negotiation-quote')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Request a negotiation-based price quote for rides/parcels',
  })
  async getNegotiationQuote(@Body() dto: PricingQuoteDto) {
    return this.pricingService.getNegotiationQuote(dto);
  }
}
