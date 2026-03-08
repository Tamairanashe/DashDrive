import { 
  WebSocketGateway, 
  WebSocketServer, 
  SubscribeMessage, 
  OnGatewayInit, 
  OnGatewayConnection, 
  OnGatewayDisconnect 
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RealTimeGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('RealTimeGateway');

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway Initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    // Join a global room for admin broadcasts
    client.join('admin-broadcasts');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  broadcastEvent(event: string, payload: any) {
    this.logger.log(`Broadcasting event: ${event}`);
    this.server.to('admin-broadcasts').emit('platform_event', {
      event,
      payload,
      timestamp: new Date().toISOString()
    });
  }

  @SubscribeMessage('ping')
  handlePing(client: Socket, data: any): string {
    return 'pong';
  }
}
