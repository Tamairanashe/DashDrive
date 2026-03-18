import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SupportService {
  private readonly logger = new Logger(SupportService.name);

  constructor(private prisma: PrismaService) {}

  async createTicket(userId: string, dto: {
    rideId?: string;
    subject: string;
    description: string;
    category: string;
    priority?: string;
  }) {
    return this.prisma.supportTicket.create({
      data: {
        user_id: userId,
        ride_id: dto.rideId,
        subject: dto.subject,
        description: dto.description,
        category: dto.category,
        priority: dto.priority || 'normal',
      },
    });
  }

  async getTickets(userId: string) {
    return this.prisma.supportTicket.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });
  }
}
