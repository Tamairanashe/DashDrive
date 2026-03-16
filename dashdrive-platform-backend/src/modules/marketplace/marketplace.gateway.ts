import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MarketplaceService } from './marketplace.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'marketplace',
})
export class MarketplaceGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('MarketplaceGateway');

  constructor(private readonly marketplaceService: MarketplaceService) {}

  afterInit(server: Server) {
    this.logger.log('Marketplace WebSocket Gateway Initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join_conversation')
  handleJoinConversation(
    @MessageBody() conversationId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(conversationId);
    this.logger.log(`Client ${client.id} joined conversation: ${conversationId}`);
    return { event: 'joined_conversation', data: conversationId };
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @MessageBody() data: { 
      senderId: string; 
      receiverId: string; 
      listingId?: string; 
      message: string;
      conversationId: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const newMessage = await this.marketplaceService.prisma.message.create({
      data: {
        sender_id: data.senderId,
        receiver_id: data.receiverId,
        listing_id: data.listingId,
        message_text: data.message,
      },
    });

    this.server.to(data.conversationId).emit('new_message', newMessage);
    return newMessage;
  }
}
