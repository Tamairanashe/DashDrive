import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class MerchantsService {
    constructor(private prisma: PrismaService) { }

    async register(data: {
        email: string;
        password: string;
        storeName: string;
        countryCode: string;
    }) {
        const country = await this.prisma.country.findUnique({
            where: { code: data.countryCode.toUpperCase() },
        });

        if (!country) {
            throw new BadRequestException('Invalid country code');
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        return this.prisma.merchant.create({
            data: {
                email: data.email,
                passwordHash: hashedPassword,
                storeName: data.storeName,
                countryId: country.id,
            },
        });
    }

    async getProfile(merchantId: string) {
        return this.prisma.merchant.findUnique({
            where: { id: merchantId },
            include: {
                country: true,
                stores: true,
            },
        });
    }
}
