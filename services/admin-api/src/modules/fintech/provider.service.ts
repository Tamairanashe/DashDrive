import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProviderService {
  private readonly CONFIG_PREFIX = 'FINTECH_PROVIDER_';

  constructor(private prisma: PrismaService) {}

  async listProviders() {
    const configs = await this.prisma.adminGlobalConfig.findMany({
      where: {
        key: {
          startsWith: this.CONFIG_PREFIX,
        },
      },
    });

    return configs.map(config => ({
      key: config.key.replace(this.CONFIG_PREFIX, ''),
      ...(config.value as any),
    }));
  }

  async getProvider(providerKey: string) {
    const config = await this.prisma.adminGlobalConfig.findUnique({
      where: { key: `${this.CONFIG_PREFIX}${providerKey.toUpperCase()}` },
    });

    if (!config) {
      throw new NotFoundException(`Provider ${providerKey} configuration not found`);
    }

    return {
      key: providerKey.toUpperCase(),
      ...(config.value as any),
    };
  }

  async upsertProvider(providerKey: string, data: {
    name: string;
    type: string;
    endpoint: string;
    integrationId?: string;
    integrationKey?: string;
    isActive?: boolean;
    metadata?: any;
  }) {
    const key = `${this.CONFIG_PREFIX}${providerKey.toUpperCase()}`;
    
    return this.prisma.adminGlobalConfig.upsert({
      where: { key },
      update: {
        value: data as any,
        description: `Configuration for fintech provider ${data.name}`,
      },
      create: {
        key,
        value: data as any,
        description: `Configuration for fintech provider ${data.name}`,
      },
    });
  }

  async deleteProvider(providerKey: string) {
    const key = `${this.CONFIG_PREFIX}${providerKey.toUpperCase()}`;
    return this.prisma.adminGlobalConfig.delete({
      where: { key },
    });
  }
}
