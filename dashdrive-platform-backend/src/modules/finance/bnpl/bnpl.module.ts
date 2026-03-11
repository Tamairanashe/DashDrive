import { Module } from '@nestjs/common';
import { BnplController } from './bnpl.controller';
import { AuthModule } from '../../core/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [BnplController],
})
export class BnplModule {}
