import { Module } from '@nestjs/common';
import { MobileMerchantModule } from './merchant/merchant.module';

@Module({
  imports: [MobileMerchantModule],
})
export class MobileModule {}
