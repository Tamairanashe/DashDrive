import { Module } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { DeliveryController } from './delivery.controller';
import { DeliveryGateway } from './delivery.gateway';
import { PrismaModule } from '../../prisma/prisma.module';
import { RidersModule } from '../riders/riders.module';
import { WebhooksModule } from '../webhooks/webhooks.module';

@Module({
    imports: [PrismaModule, RidersModule, WebhooksModule],
    controllers: [DeliveryController],
    providers: [DeliveryService, DeliveryGateway],
    exports: [DeliveryService],
})
export class DeliveryModule { }
