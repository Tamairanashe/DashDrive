import { Module } from '@nestjs/common';
import { RideService } from './ride.service';
import { RideController } from './ride.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { RideTrackingGateway } from './ride-tracking.gateway';
import { DriverWalletService } from './driver-wallet.service';

@Module({
  imports: [PrismaModule],
  controllers: [RideController],
  providers: [RideService, RideTrackingGateway, DriverWalletService],
  exports: [RideService, DriverWalletService],
})
export class RideModule {}
