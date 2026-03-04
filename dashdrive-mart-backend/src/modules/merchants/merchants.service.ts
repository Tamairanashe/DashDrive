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

        return this.prisma.$transaction(async (tx) => {
            const merchant = await tx.merchant.create({
                data: {
                    email: data.email,
                    passwordHash: hashedPassword,
                    storeName: data.storeName,
                    countryId: country.id,
                },
            });

            const store = await tx.store.create({
                data: {
                    merchantId: merchant.id,
                    name: data.storeName,
                    address: 'Pending Setup',
                    city: 'Pending Setup',
                    currency: country.currency,
                    timezone: country.timezone,
                    isActive: false, // Inactive until onboarding is complete
                },
            });

            return { merchant, store };
        });
    }

    async updatePushToken(merchantId: string, pushToken: string) {
        return this.prisma.merchant.update({
            where: { id: merchantId },
            data: { pushToken },
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
