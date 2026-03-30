import { Module } from '@nestjs/common';
import { FinancialsService } from './financials.service';
import { FinancialsController } from './financials.controller';
import { BatchSettlementService } from './batch-settlement.service';

@Module({
  providers: [FinancialsService, BatchSettlementService],
  controllers: [FinancialsController],
  exports: [BatchSettlementService],
})
export class FinancialsModule {}
