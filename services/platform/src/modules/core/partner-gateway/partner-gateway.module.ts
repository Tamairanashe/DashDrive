import { Module } from '@nestjs/common';
import { RequestSigningService } from './request-signing.service';

@Module({
  providers: [RequestSigningService],
  exports: [RequestSigningService],
})
export class PartnerGatewayModule {}
