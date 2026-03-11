import { Module, Global } from '@nestjs/common';
import { CreditBureauService } from './credit-bureau.service';
import { PaymentGatewayService } from './payment-gateway.service';

@Global()
@Module({
  providers: [CreditBureauService, PaymentGatewayService],
  exports: [CreditBureauService, PaymentGatewayService],
})
export class IntegrationsModule {}
