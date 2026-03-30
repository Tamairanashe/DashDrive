import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TicketStatus } from '@prisma/client';

@Injectable()
export class SupportService {
  constructor(private prisma: PrismaService) {}

  async createTicket(data: any) {
    return this.prisma.supportTicket.create({
      data: {
        ...data,
        status: TicketStatus.OPEN,
      },
    });
  }

  async getTickets(status?: TicketStatus) {
    return this.prisma.supportTicket.findMany({
      where: status ? { status } : {},
      orderBy: { createdAt: 'desc' },
      include: { order: true },
    });
  }

  async updateTicketStatus(id: string, status: TicketStatus) {
    return this.prisma.supportTicket.update({
      where: { id },
      data: { status },
    });
  }

  async getTicketDetails(id: string) {
    const ticket = await this.prisma.supportTicket.findUnique({
      where: { id },
      include: { order: true },
    });
    if (!ticket) throw new NotFoundException('Ticket not found');
    return ticket;
  }
}
