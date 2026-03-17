import { Module, Global } from '@nestjs/common';
import { CreditBureauService } from './credit-bureau.service';
import { PaymentGatewayService } from './payment-gateway.service';
import { LogisticsIntegrationService } from './logistics-engine.service';
import { FintechModule } from '../fintech/fintech.module';

@Global()
@Module({
  imports: [FintechModule],
  providers: [CreditBureauService, PaymentGatewayService, LogisticsIntegrationService],
  exports: [CreditBureauService, PaymentGatewayService, LogisticsIntegrationService],
})
export class IntegrationsModule {}
