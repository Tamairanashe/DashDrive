import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { WebhooksController } from './webhooks.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { OrdersModule } from '../orders/orders.module';

@Module({
    imports: [PrismaModule, OrdersModule],
    providers: [PaymentsService],
    controllers: [PaymentsController, WebhooksController],
    exports: [PaymentsService],
})
export class PaymentsModule { }
