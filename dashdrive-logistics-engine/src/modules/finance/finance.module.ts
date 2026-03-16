import { Module } from '@nestjs/common';
import { FinanceController } from './finance.controller';
import { InvoicingService } from './invoicing.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [PrismaModule, WalletModule],
  controllers: [FinanceController],
  providers: [InvoicingService],
  exports: [InvoicingService],
})
export class FinanceModule {}
