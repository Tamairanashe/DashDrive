import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { FraudService } from './fraud.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('fraud')
@Controller('fraud')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class FraudController {
  constructor(private readonly fraudService: FraudService) {}

  @Get('events')
  @ApiOperation({ summary: 'Get recent risk events (Admin only)' })
  async getEvents(@Query('limit') limit?: number) {
    // In production, add Rozle check for ADMIN only
    return this.fraudService.getRiskEvents(limit ? Number(limit) : 50);
  }
}
