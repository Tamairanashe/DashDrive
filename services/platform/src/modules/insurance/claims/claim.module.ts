import { Module } from '@nestjs/common';
import { ClaimController } from './claim.controller';
import { AuthModule } from '../../core/auth/auth.module';
import { InsuranceService } from './insurance.service';

@Module({
  imports: [AuthModule],
  controllers: [ClaimController],
  providers: [InsuranceService],
})
export class ClaimModule {}
