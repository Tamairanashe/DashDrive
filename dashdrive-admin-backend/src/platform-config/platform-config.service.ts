import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AdminGlobalConfig } from '@prisma/client';

@Injectable()
export class PlatformConfigService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<AdminGlobalConfig[]> {
    return this.prisma.adminGlobalConfig.findMany({
      orderBy: { key: 'asc' },
    });
  }

  async findByKey(key: string): Promise<AdminGlobalConfig | null> {
    return this.prisma.adminGlobalConfig.findUnique({
      where: { key },
    });
  }

  async update(key: string, value: any, description?: string): Promise<AdminGlobalConfig> {
    return this.prisma.adminGlobalConfig.upsert({
      where: { key },
      update: { value, description },
      create: { key, value, description },
    });
  }
}
