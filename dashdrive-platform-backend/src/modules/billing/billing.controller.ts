import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { BillingService } from './billing.service';
import { ApiKeyGuard } from '../core/auth/api-key.guard';

@Controller('api/billing')
@UseGuards(ApiKeyGuard)
export class BillingController {
  constructor(private billingService: BillingService) {}

  @Get('summary')
  async getRevenueSummary(@Query('cycle') cycle?: string) {
    return this.billingService.getRevenueSummary(cycle);
  }

  @Get('rates')
  async getCommissionRates() {
    return {
      ride: await this.billingService.getCommissionRate('ride'),
      delivery: await this.billingService.getCommissionRate('delivery'),
      hotel: await this.billingService.getCommissionRate('hotel'),
      fuel: await this.billingService.getCommissionRate('fuel'),
      transit: await this.billingService.getCommissionRate('transit'),
      marketplace: await this.billingService.getCommissionRate('marketplace'),
      insurance: await this.billingService.getCommissionRate('insurance'),
      rental: await this.billingService.getCommissionRate('rental'),
    };
  }

  @Post('process-payment')
  async processPayment(@Body() data: { referenceId: string; type: string; amount: number; vertical?: string }) {
    return this.billingService.recordTransaction(data);
  }

  @Post('settle')
  async settlePayouts(@Body() data: { billingCycle?: string }) {
    return this.billingService.settlePayouts(data.billingCycle);
  }
}
