import { Injectable, UnauthorizedException, ConflictException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { MerchantsService } from '../merchants/merchants.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

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

    async forgotPassword(email: string) {
        const merchant = await this.prisma.merchant.findUnique({
            where: { email },
        });

        if (!merchant) {
            // According to the frontend logic, if it says "contact your Store Owner", it's a restricted role.
            // But here we're only dealing with standard merchants without roles implemented yet, so we just mock the success 
            // to prevent email enumeration, but log the "mock" email send.
            this.logger.warn(`Password reset requested for unknown email: ${email}`);

            // Standard security practice: return success even if not found to prevent timing/enum attacks.
            return { message: 'If that email is in our database, we will send a password reset link shortly.' };
        }

        this.logger.log(`Mocking password reset email send for legitimate user: ${email}`);
        return { message: 'If that email is in our database, we will send a password reset link shortly.' };
    }
}
