import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MockPosProvider } from '../providers/mock-pos.provider';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mockProvider: MockPosProvider,
  ) {}

  async registerConnection(merchantId: string, provider: string, credentials?: any) {
    // Basic validation
    if (!merchantId || !provider) {
      throw new BadRequestException('Merchant ID and Provider are required');
    }

    const providerType = provider.toUpperCase();

    // In a real system, we would have a factory to get the correct provider
    // For now, we only have Mock
    if (providerType !== 'GENERIC_API' && providerType !== 'MOCK') {
        // We'll allow MOCK as a special type for now
    }

    // Call provider to validate/get tokens
    const result = await this.mockProvider.connect(merchantId, credentials);
    if (!result.success) {
        throw new BadRequestException(result.error || 'Failed to connect to POS');
    }

    // Upsert the connection logic
    const connection = await this.prisma.posConnection.upsert({
      where: {
        merchantId_provider: {
          merchantId,
          provider: 'GENERIC_API' as any, // Defaulting to GENERIC_API for the enum for now
        }
      },
      update: {
        accessToken: result.accessToken,
        webhookSecret: result.webhookSecret,
        isActive: true,
      },
      create: {
        merchantId,
        provider: 'GENERIC_API' as any,
        accessToken: result.accessToken,
        webhookSecret: result.webhookSecret,
      }
    });

    return { success: true, connectionId: connection.id };
  }
}
