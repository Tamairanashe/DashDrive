import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { MerchantsModule } from '../merchants/merchants.module';
import { ApiKeyAuthGuard } from './api-key-auth.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { SystemAuthGuard } from '../../common/guards/system-auth.guard';

@Module({
  imports: [
    PassportModule,
    MerchantsModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'supersecret',
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, ApiKeyAuthGuard, SystemAuthGuard],
  exports: [AuthService, SystemAuthGuard],
})
export class AuthModule {}
