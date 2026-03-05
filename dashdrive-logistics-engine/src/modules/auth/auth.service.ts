import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { MerchantsService } from '../merchants/merchants.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private merchantsService: MerchantsService,
    ) { }

    async login(email: string, pass: string) {
        const merchant = await this.prisma.merchant.findUnique({
            where: { email },
        });

        if (!merchant) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(pass, merchant.passwordHash);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { sub: merchant.id, email: merchant.email };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async register(registerDto: RegisterDto) {
        try {
            const { merchant, store } = await this.merchantsService.register(registerDto);
            const payload = { sub: merchant.id, email: merchant.email };
            return {
                merchant,
                store,
                access_token: this.jwtService.sign(payload),
            };
        } catch (error: any) {
            if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
                throw new ConflictException('An account with this email already exists');
            }
            throw error;
        }
    }

    async validateUser(payload: any) {
        return this.prisma.merchant.findUnique({
            where: { id: payload.sub },
        });
    }
}
