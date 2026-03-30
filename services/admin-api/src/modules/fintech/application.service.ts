import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { FintechStatus } from '@prisma/client';

@Injectable()
export class ApplicationService {
  private readonly logger = new Logger(ApplicationService.name);

  constructor(private prisma: PrismaService) {}

  async createApplication(leadId: string, externalAppId?: string) {
    this.logger.log(`Creating fintech application for lead ${leadId}`);

    return this.prisma.fintechApplication.create({
      data: {
        leadId,
        externalAppId,
        status: FintechStatus.APPLICATION_STARTED,
      },
    });
  }

  async updateApplicationStatus(externalAppId: string, status: FintechStatus, currentStep?: string) {
    return this.prisma.fintechApplication.update({
      where: { externalAppId },
      data: { 
        status,
        currentStep,
        lastUpdate: new Date(),
      },
    });
  }
}
