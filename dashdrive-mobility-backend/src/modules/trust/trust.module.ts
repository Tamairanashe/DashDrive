import { Module, Global } from '@nestjs/common';
import { TrustService } from './trust.service';
import { SupportService } from './support.service';
import { ReferralService } from './referral.service';
import { MarketingNotificationService } from './marketing-notification.service';
import { IdentityVerificationService } from './identity-verification.service';

@Global()
@Module({
  providers: [
    TrustService, 
    SupportService, 
    ReferralService, 
    MarketingNotificationService, 
    IdentityVerificationService
  ],
  exports: [
    TrustService, 
    SupportService, 
    ReferralService, 
    MarketingNotificationService, 
    IdentityVerificationService
  ],
})
export class TrustModule {}
