import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { FintechProductType, FintechStatus } from '@prisma/client';

@Injectable()
export class LeadService {
  private readonly logger = new Logger(LeadService.name);

  constructor(private prisma: PrismaService) {}

  async createLead(data: {
    userId: string;
    userType: string;
    productType: FintechProductType;
    provider: string;
    offerId?: string;
    initialAmount?: number;
    apr? : number;
    metadata?: any;
  }) {
    this.logger.log(`Creating fintech lead for user ${data.userId} with provider ${data.provider}`);

    // Mock External Lead Creation (e.g., calling MoneyLion Engine)
    const externalLeadUuid = `ext-${Math.random().toString(36).substring(2, 11)}`;

    return this.prisma.fintechLead.create({
      data: {
        leadUuid: externalLeadUuid,
        userId: data.userId,
        userType: data.userType,
        productType: data.productType,
        provider: data.provider,
        offerId: data.offerId,
        initialAmount: data.initialAmount,
        apr: data.apr,
        status: FintechStatus.LEAD_CREATED,
        metadata: data.metadata || {},
      },
    });
  }

  async getLeadByUuid(leadUuid: string) {
    return this.prisma.fintechLead.findUnique({
      where: { leadUuid },
    });
  }

  async updateLeadStatus(leadUuid: string, status: FintechStatus) {
    return this.prisma.fintechLead.update({
      where: { leadUuid },
      data: { status },
    });
  }
}
