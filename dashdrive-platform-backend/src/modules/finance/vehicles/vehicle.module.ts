import { Module } from '@nestjs/common';
import { VehicleController } from './vehicle.controller';
import { AuthModule } from '../../core/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [VehicleController],
})
export class VehicleModule {}
