import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class DeveloperService {
  constructor(private prisma: PrismaService) {}

  async generateKey(merchantId: string, name: string) {
    // Generate a random key with "sk_live_" prefix
    const randomString = crypto.randomBytes(32).toString('hex');
    const key = `sk_live_${randomString}`;

    return this.prisma.apiKey.create({
      data: {
        merchantId,
        key,
        name: name || 'Default Key',
        isActive: true,
      },
      select: {
        id: true,
        key: true,
        name: true,
        createdAt: true,
        lastUsedAt: true,
        isActive: true,
      },
    });
  }

  async listKeys(merchantId: string) {
    return this.prisma.apiKey.findMany({
      where: { merchantId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        key: true,
        name: true,
        createdAt: true,
        lastUsedAt: true,
        isActive: true,
      },
    });
  }

  async revokeKey(merchantId: string, id: string) {
    const apiKey = await this.prisma.apiKey.findFirst({
      where: { id, merchantId },
    });

    if (!apiKey) {
      throw new NotFoundException('API Key not found');
    }

    return this.prisma.apiKey.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
