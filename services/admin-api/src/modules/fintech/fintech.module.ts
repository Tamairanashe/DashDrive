import { Module } from '@nestjs/common';
import { LeadService } from './lead.service';
import { ApplicationService } from './application.service';
import { WebhookService } from './webhook.service';
import { CommissionService } from './commission.service';
import { MatchingService } from './matching.service';
import { FintechController } from './fintech.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { WalletService } from './wallet.service';
import { PaymentService } from './payment.service';
import { UtilityService } from './utility.service';
import { InsuranceService } from './insurance.service';
import { ComplianceService } from './compliance.service';
import { PaynowProvider } from './providers/paynow.provider';
import { ProviderService } from './provider.service';

import { BillerService } from './biller.service';

@Module({
  imports: [PrismaModule],
  controllers: [FintechController],
  providers: [
    LeadService,
    ApplicationService,
    WebhookService,
    CommissionService,
    MatchingService,
    WalletService,
    PaymentService,
    UtilityService,
    InsuranceService,
    ComplianceService,
    PaynowProvider,
    BillerService,
    ProviderService,
  ],
  exports: [
    LeadService,
    ApplicationService,
    MatchingService,
    WalletService,
    PaymentService,
    PaynowProvider,
    BillerService,
    ProviderService,
  ],
})
export class FintechModule {}
