import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApplicationsService } from './applications.service';

@Controller('api/applications')
export class ApplicationsController {
  constructor(private readonly appsService: ApplicationsService) {}

  @Get()
  getApplications(@Query('partner') partner?: string) {
    if (partner) {
      return this.appsService.findByPartnerId(partner);
    }
    return this.appsService.findAll();
  }

  @Post()
  createApplication(@Body() body: any) {
    return this.appsService.create(body);
  }
}
