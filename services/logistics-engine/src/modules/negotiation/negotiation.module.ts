import { Module } from '@nestjs/common';
import { NegotiationController } from './negotiation.controller';
import { NegotiationService } from './negotiation.service';
import { PricingModule } from '../pricing/pricing.module';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PricingModule, PrismaModule],
  controllers: [NegotiationController],
  providers: [NegotiationService],
  exports: [NegotiationService],
})
export class NegotiationModule {}
