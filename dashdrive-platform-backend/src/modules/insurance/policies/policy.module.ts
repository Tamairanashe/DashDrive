import { Module } from '@nestjs/common';
import { PolicyController } from './policy.controller';
import { AuthModule } from '../../core/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [PolicyController],
})
export class PolicyModule {}
