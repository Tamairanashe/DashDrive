import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SupabaseService } from './supabase.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private supabaseService: SupabaseService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const supabase = this.supabaseService.getClient();

        // 1. Authenticate with Supabase
        const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
            email,
            password: pass,
        });

        if (authErr || !authData.user) {
            console.error('[Auth] Supabase login failed:', authErr?.message);
            return null;
        }

        // 2. Fetch profile from local DB (Prisma) to get roles/metadata
        const user = await this.usersService.findOne(email);
        if (!user) {
            console.warn('[Auth] Supabase user authenticated but profile missing in local DB:', email);
            // Fallback: Use info from Supabase if local profile is missing
            return {
                id: authData.user.id,
                email: authData.user.email,
                name: authData.user.user_metadata?.name || email,
                role: 'SUPPORT_AGENT', // Default role
            };
        }

        return user;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id, role: user.role };
        await this.usersService.updateLastLogin(user.id);
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        };
    }
}
