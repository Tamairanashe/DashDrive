import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { LeadService } from './lead.service';
import { WebhookService } from './webhook.service';
import { MatchingService, UserProfile, FinancialProduct } from './matching.service';
import { FintechProductType } from '@prisma/client';

@Controller('fintech')
export class FintechController {
  constructor(
    private leadService: LeadService,
    private webhookService: WebhookService,
    private matchingService: MatchingService,
  ) {}

  @Post('leads')
  async createLead(@Body() data: any) {
    return this.leadService.createLead(data);
  }

  @Post('matching/rank')
  async rankOffers(@Body() data: { user: UserProfile; products: FinancialProduct[]; config?: any }) {
    return this.matchingService.rankOffers(data.user, data.products, data.config);
  }

  @Post('webhooks/postback')
  async handlePostback(@Body() payload: any) {
    return this.webhookService.handlePostback(payload);
  }

  @Get('leads/:uuid')
  async getLead(@Param('uuid') uuid: string) {
    return this.leadService.getLeadByUuid(uuid);
  }
}
