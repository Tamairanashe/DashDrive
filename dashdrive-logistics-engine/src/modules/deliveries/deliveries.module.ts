import { Module } from '@nestjs/common';
import { DeliveriesController } from './deliveries.controller';
import { DeliveriesService } from './deliveries.service';
import { PricingModule } from '../pricing/pricing.module';
import { DispatchModule } from '../dispatch/dispatch.module';

@Module({
    imports: [PricingModule, DispatchModule],
    controllers: [DeliveriesController],
    providers: [DeliveriesService],
})
export class DeliveriesModule { }
