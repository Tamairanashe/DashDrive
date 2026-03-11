import { Module } from '@nestjs/common';
import { LeadService } from './lead.service';
import { ApplicationService } from './application.service';
import { WebhookService } from './webhook.service';
import { CommissionService } from './commission.service';
import { MatchingService } from './matching.service';
import { FintechController } from './fintech.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FintechController],
  providers: [
    LeadService, 
    ApplicationService, 
    WebhookService, 
    CommissionService, 
    MatchingService
  ],
  exports: [LeadService, ApplicationService, MatchingService],
})
export class FintechModule {}
