import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { RideService } from './ride.service';
import { DriverWalletService } from './driver-wallet.service';
import { CreateRideDto } from './dto/create-ride.dto';

@Controller('rides')
export class RideController {
  constructor(
    private readonly rideService: RideService,
    private readonly driverWalletService: DriverWalletService,
  ) {}

  @Get('service-types')
  getServiceTypes() {
    return this.rideService.getServiceTypes();
  }

  @Post('estimate')
  estimateFare(
    @Body() data: { serviceTypeId: string; pickupLat: number; pickupLng: number; dropoffLat: number; dropoffLng: number }
  ) {
    return this.rideService.estimateFare(data);
  }

  @Post('request')
  requestRide(@Body() data: CreateRideDto) {
    return this.rideService.requestRide(data);
  }

  @Post(':id/complete')
  completeTrip(@Param('id') id: string) {
    return this.rideService.completeTrip(id);
  }

  @Post(':id/accept')
  acceptRide(@Param('id') id: string, @Body() data: { driverId: string }) {
    return this.rideService.acceptRide(id, data.driverId);
  }

  // --- Driver Wallet & Bundles ---

  @Get('bundles')
  getRideBundles() {
    return this.driverWalletService.getRideBundles();
  }

  @Get('driver-wallet/:driverProfileId')
  getDriverWallet(@Param('driverProfileId') id: string) {
    return this.driverWalletService.getDriverWallet(id);
  }

  @Get('driver-wallet/:driverProfileId/bundles')
  getActiveBundles(@Param('driverProfileId') id: string) {
    return this.driverWalletService.getActiveBundles(id);
  }

  @Post('driver-wallet/:driverProfileId/topup')
  topUp(@Param('driverProfileId') id: string, @Body() data: { amount: number }) {
    return this.driverWalletService.topUp(id, data.amount);
  }

  @Post('bundle/purchase')
  purchaseBundle(@Body() data: { driverProfileId: string; bundleId: string }) {
    return this.driverWalletService.purchaseBundle(data.driverProfileId, data.bundleId);
  }
}
