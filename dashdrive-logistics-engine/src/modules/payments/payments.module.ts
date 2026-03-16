import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { WebhooksController } from './webhooks.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { OrdersModule } from '../orders/orders.module';
import { WalletModule } from '../wallet/wallet.module';
import { MockPaymentProvider } from './payment-providers/mock.provider';

@Module({
  imports: [PrismaModule, OrdersModule, WalletModule],
  providers: [PaymentsService, MockPaymentProvider],
  controllers: [PaymentsController, WebhooksController],
  exports: [PaymentsService],
})
export class PaymentsModule {}
