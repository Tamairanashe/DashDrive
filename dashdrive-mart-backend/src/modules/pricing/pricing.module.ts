import { Module } from '@nestjs/common';
import { PricingService } from './pricing.service';
import { PricingController } from './pricing.controller';
import { PricingGateway } from './pricing.gateway';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [PricingService, PricingGateway],
    controllers: [PricingController],
    exports: [PricingService],
})
export class PricingModule { }
