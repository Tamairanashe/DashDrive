import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class EventBookingService {
  constructor(private prisma: PrismaService) {}

  async listEvents(category?: string) {
    const events = [
      { id: 'ev-1', title: 'DashDrive Launch Party', category: 'festival', venue: 'Harare Convention Center', startDate: '2026-04-15', status: 'upcoming', isFeatured: true },
      { id: 'ev-2', title: 'Tech Summit Africa', category: 'conference', venue: 'Kigali Arena', startDate: '2026-05-20', status: 'upcoming', isFeatured: false },
      { id: 'ev-3', title: 'Afrobeats Night', category: 'music', venue: 'Lagos Arena', startDate: '2026-04-01', status: 'upcoming', isFeatured: true },
    ];
    return category ? events.filter(e => e.category === category) : events;
  }

  async getTicketTypes(eventId: string) {
    return [
      { id: 'tt-1', eventId, name: 'General Admission', price: 15, totalQty: 500, soldQty: 120 },
      { id: 'tt-2', eventId, name: 'VIP', price: 50, totalQty: 100, soldQty: 30 },
      { id: 'tt-3', eventId, name: 'VVIP', price: 100, totalQty: 20, soldQty: 5 },
    ];
  }

  async purchaseTicket(data: { userId: string; ticketTypeId: string; quantity: number }) {
    const tickets: Array<{ id: string; ticketTypeId: string; userId: string; qrCode: string; status: string; purchasedAt: Date }> = [];
    for (let i = 0; i < data.quantity; i++) {
      tickets.push({
        id: `ticket-${Date.now()}-${i}`,
        ticketTypeId: data.ticketTypeId,
        userId: data.userId,
        qrCode: `QR-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        status: 'valid',
        purchasedAt: new Date(),
      });
    }
    return { tickets, totalCost: data.quantity * 50 }; // price would come from DB
  }
}
