import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AlertsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.riskEvent.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async findOne(id: string) {
    const alert = await this.prisma.riskEvent.findUnique({
      where: { id },
    });

    if (!alert) {
      throw new NotFoundException(`Alert with ID ${id} not found`);
    }

    return alert;
  }

  async updateDecision(id: string, decision: 'APPROVED' | 'REVIEW' | 'BLOCKED') {
    return this.prisma.riskEvent.update({
      where: { id },
      data: { decision },
    });
  }

  async dismissAlert(id: string) {
    // In this schema, we just update the decision to APPROVED as a way of "dismissing" or resolving it
    return this.prisma.riskEvent.update({
      where: { id },
      data: { decision: 'APPROVED' },
    });
  }
}
