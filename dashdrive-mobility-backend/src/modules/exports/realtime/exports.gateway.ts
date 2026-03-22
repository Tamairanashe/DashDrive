// src/modules/exports/realtime/exports.gateway.ts

import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

type ExportJobEventPayload = {
  jobId: string;
  module: string;
  status: 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress?: number;
  stage?: string;
  fileName?: string;
  contentType?: string;
  downloadUrl?: string;
  errorCode?: string;
  message?: string;
  createdAt?: string;
  completedAt?: string;
};

type AuthenticatedSocket = Socket & {
  data: {
    userId?: string;
  };
};

@WebSocketGateway({
  namespace: '/exports',
  cors: {
    origin: true,
    credentials: true,
  },
})
export class ExportsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(ExportsGateway.name);

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const token = this.extractToken(client);
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = await this.jwtService.verifyAsync<{ sub: string }>(token);
      const userId = payload.sub;

      client.data.userId = userId;
      client.join(this.getUserRoom(userId));

      this.logger.log(`Client connected: ${client.id}, user: ${userId}`);
      client.emit('exports.connected', { ok: true, userId });
    } catch (error) {
      this.logger.warn(`Socket auth failed for client ${client.id}: ${error.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  emitToUser(userId: string, event: string, payload: ExportJobEventPayload) {
    const room = this.getUserRoom(userId);
    this.server.to(room).emit(event, payload);
    this.logger.log(`Emitted ${event} to user ${userId} in room ${room}`);
  }

  private getUserRoom(userId: string) {
    return `user:${userId}`;
  }

  private extractToken(client: Socket): string | null {
    const authHeader =
      client.handshake.auth?.token ||
      client.handshake.headers.authorization ||
      null;

    if (!authHeader || typeof authHeader !== 'string') return null;

    if (authHeader.startsWith('Bearer ')) {
      return authHeader.slice(7);
    }

    return authHeader;
  }
}
