import { Controller, Post, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { DirectService } from './direct.service';
import { CreateDirectDeliveryDto } from './dto/create-direct-delivery.dto';
import { ApiKeyGuard } from '../../common/guards/api-key.guard';

@Controller('api/v1/direct')
@UseGuards(ApiKeyGuard)
export class DirectController {
  constructor(private readonly directService: DirectService) {}

  @Post('deliveries')
  async createDelivery(@Req() req: any, @Body() dto: CreateDirectDeliveryDto) {
    // req.merchant is attached by ApiKeyGuard
    return this.directService.createDelivery(req.merchant.id, dto);
  }

  @Get('deliveries/:id')
  async getDeliveryStatus(@Req() req: any, @Param('id') id: string) {
    return this.directService.getDeliveryStatus(req.merchant.id, id);
  }
}
