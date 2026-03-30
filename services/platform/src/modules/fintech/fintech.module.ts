import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { FintechController } from './fintech.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [WalletService],
  controllers: [FintechController],
  exports: [WalletService],
})
export class FintechModule {}
