import { Controller, Get, Param } from '@nestjs/common';
import { FinancialsService } from './financials.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Financials')
@Controller('financials')
export class FinancialsController {
  constructor(private readonly financialsService: FinancialsService) {}

  @Get('history/:hostId')
  @ApiOperation({ summary: 'Get earnings history for a host' })
  getHistory(@Param('hostId') hostId: string) {
    return this.financialsService.getEarningsHistory(hostId);
  }

  @Get('summary/:hostId')
  @ApiOperation({ summary: 'Get financial summary (totals, pending, etc.)' })
  getSummary(@Param('hostId') hostId: string) {
    return this.financialsService.getFinancialSummary(hostId);
  }
}
