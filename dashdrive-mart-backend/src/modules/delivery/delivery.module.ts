import { Module } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { DeliveryController } from './delivery.controller';
import { DeliveryGateway } from './delivery.gateway';
import { PrismaModule } from '../../prisma/prisma.module';
import { RidersModule } from '../riders/riders.module';

@Module({
    imports: [PrismaModule, RidersModule],
    controllers: [DeliveryController],
    providers: [DeliveryService, DeliveryGateway],
    exports: [DeliveryService],
})
export class DeliveryModule { }
