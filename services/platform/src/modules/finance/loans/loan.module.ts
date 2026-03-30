import { Module } from '@nestjs/common';
import { LoanController } from './loan.controller';
import { AuthModule } from '../../core/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [LoanController],
})
export class LoanModule {}
