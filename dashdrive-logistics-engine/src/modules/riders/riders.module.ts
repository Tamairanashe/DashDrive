import { Module } from '@nestjs/common';
import { RidersService } from './riders.service';
import { VerificationService } from './verification.service';
import { RidersController } from './riders.controller';
import { RiderWalletController } from './rider-wallet.controller';
import { RiderWalletService } from './rider-wallet.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [RidersController, RiderWalletController],
  providers: [RidersService, VerificationService, RiderWalletService],
  exports: [RidersService, VerificationService, RiderWalletService],
})
export class RidersModule {}
