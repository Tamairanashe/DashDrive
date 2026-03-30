import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async sendMessage(data: {
    senderId: string;
    receiverId: string;
    tripId?: string;
    content: string;
  }) {
    return this.prisma.message.create({
      data: {
        senderId: data.senderId,
        receiverId: data.receiverId,
        tripId: data.tripId,
        content: data.content,
      },
    });
  }

  async getConversation(user1: string, user2: string) {
    return this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: user1, receiverId: user2 },
          { senderId: user2, receiverId: user1 },
        ],
      },
      orderBy: { created_at: 'asc' },
    });
  }

  async getMyConversations(userId: string) {
    const messages = await this.prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      orderBy: { created_at: 'desc' },
    });

    // Group by conversation partner
    const conversations = new Map();
    messages.forEach((msg) => {
      const partnerId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      if (!conversations.has(partnerId)) {
        conversations.set(partnerId, msg);
      }
    });

    return Array.from(conversations.entries()).map(([partnerId, lastMessage]) => ({
      partnerId,
      lastMessage,
    }));
  }
}
