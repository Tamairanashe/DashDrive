import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import 'dotenv/config';
import { SupabaseService } from './supabase.service';
import { RolesGuard } from './roles.guard.js';

@Module({
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'dashdrive_admin_secret_2026',
            signOptions: { expiresIn: '8h' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, SupabaseService, RolesGuard],
    exports: [AuthService, SupabaseService, RolesGuard],
})
export class AuthModule { }
