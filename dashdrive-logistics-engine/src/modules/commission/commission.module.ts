import { Module, Global } from '@nestjs/common';
import { CommissionService } from './commission.service';
import { WalletModule } from '../wallet/wallet.module';
import { PrismaModule } from '../../prisma/prisma.module';

@Global()
@Module({
  imports: [PrismaModule, WalletModule],
  providers: [CommissionService],
  exports: [CommissionService],
})
export class CommissionModule {}
