import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { BusinessType } from '@prisma/client';

@Injectable()
export class MerchantsService {
  constructor(private prisma: PrismaService) {}

  async register(data: {
    email: string;
    password: string;
    storeName: string;
    countryCode: string;
    type?: BusinessType;
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
          type: data.type || BusinessType.MART,
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

  async onboardStore(merchantId: string, data: any) {
    const merchant = await this.prisma.merchant.findUnique({
      where: { id: merchantId },
      include: { stores: true },
    });

    if (!merchant || merchant.stores.length === 0) {
      throw new BadRequestException('Merchant or store not found');
    }

    const store = merchant.stores[0];

    return this.prisma.store.update({
      where: { id: store.id },
      data: {
        name: data.storeName || store.name,
        address: data.address || store.address,
        city: data.city || store.city,
        logoUrl: data.logoUrl || store.logoUrl,
        // Keep isActive false until admin approves
      },
    });
  }
}
