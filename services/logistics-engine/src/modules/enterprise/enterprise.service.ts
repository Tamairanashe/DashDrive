import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export class CreateEnterpriseDto {
  name: string;
  adminEmail: string;
}

export class AssignMerchantDto {
  merchantId: string;
}

@Injectable()
export class EnterpriseService {
  constructor(private prisma: PrismaService) {}

  async createEnterprise(data: CreateEnterpriseDto) {
    return this.prisma.enterprise.create({
      data: {
        name: data.name,
        adminEmail: data.adminEmail,
      },
    });
  }

  async getEnterprises() {
    return this.prisma.enterprise.findMany({
      include: {
        merchants: true,
      },
    });
  }

  async getEnterpriseById(id: string) {
    const ent = await this.prisma.enterprise.findUnique({
      where: { id },
      include: { merchants: { include: { stores: true } } },
    });
    if (!ent) throw new NotFoundException('Enterprise not found');
    return ent;
  }

  async assignMerchant(enterpriseId: string, data: AssignMerchantDto) {
    // Ensure enterprise exists
    await this.getEnterpriseById(enterpriseId);

    return this.prisma.merchant.update({
      where: { id: data.merchantId },
      data: { enterpriseId },
    });
  }

  async removeMerchant(enterpriseId: string, merchantId: string) {
    return this.prisma.merchant.updateMany({
      where: { id: merchantId, enterpriseId },
      data: { enterpriseId: null },
    });
  }
}
