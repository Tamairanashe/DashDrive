import { Module } from '@nestjs/common';
import { BillingController } from './billing.controller';
import { AuthModule } from '../core/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [BillingController],
})
export class BillingModule {}
