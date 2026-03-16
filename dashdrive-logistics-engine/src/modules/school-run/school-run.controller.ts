import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { SchoolRunService } from './school-run.service';

@Controller('api/school-run')
export class SchoolRunController {
  constructor(private readonly schoolRunService: SchoolRunService) {}

  @Post('subscriptions')
  async createSubscription(@Body() body: any) {
    return this.schoolRunService.createSubscription(body);
  }

  @Get('subscriptions')
  async getSubscriptions(@Query('parentId') parentId: string) {
    return this.schoolRunService.getSubscriptions(parentId);
  }

  @Post('generate-daily')
  async generateDaily() {
    await this.schoolRunService.generateDailyDeliveries();
    return { status: 'Triggered' };
  }
}
