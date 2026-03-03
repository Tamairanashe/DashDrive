import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
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

    async validateUser(payload: any) {
        return this.prisma.merchant.findUnique({
            where: { id: payload.sub },
        });
    }
}
