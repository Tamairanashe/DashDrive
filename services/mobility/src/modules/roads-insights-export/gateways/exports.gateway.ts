// src/modules/roads-insights-export/gateways/exports.gateway.ts

import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  namespace: '/exports',
  cors: {
    origin: '*',
  },
})
export class ExportsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ExportsGateway.name);

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      client.join(`user:${userId}`);
      this.logger.log(`Client connected: ${client.id} (User: ${userId})`);
    } else {
      this.logger.warn(`Client connected without userId: ${client.id}`);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  emitToUser(userId: string, event: string, payload: any) {
    this.server.to(`user:${userId}`).emit(event, payload);
  }

  emitToJob(jobId: string, event: string, payload: any) {
    this.server.emit(`${event}:${jobId}`, payload);
  }
}
