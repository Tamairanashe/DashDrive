import { Module, Global } from '@nestjs/common';
import { TrustService } from './trust.service';
import { SupportService } from './support.service';

@Global()
@Module({
  providers: [TrustService, SupportService],
  exports: [TrustService, SupportService],
})
export class TrustModule {}
