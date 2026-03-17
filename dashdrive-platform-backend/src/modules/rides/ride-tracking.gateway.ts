import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'rides',
})
export class RideTrackingGateway {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(RideTrackingGateway.name);

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    const isDriver = client.handshake.query.isDriver === 'true';

    if (userId) {
      client.join(`user_${userId}`);
      if (isDriver) {
        client.join('drivers');
        this.logger.log(`Driver ${userId} joined drivers pool`);
      }
    }
    this.logger.log(`Client connected: ${client.id} (User: ${userId})`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRide')
  handleJoinRide(
    @MessageBody() data: { rideId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`ride_${data.rideId}`);
    this.logger.log(`Client ${client.id} joined ride room: ride_${data.rideId}`);
    return { event: 'joined', data: { rideId: data.rideId } };
  }

  @SubscribeMessage('updateLocation')
  handleUpdateLocation(
    @MessageBody() data: { rideId: string; lat: number; lng: number; bearing?: number },
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`Location update for ride ${data.rideId}: ${data.lat}, ${data.lng}`);
    
    // Broadcast to everyone in the ride room (primarily the customer)
    this.server.to(`ride_${data.rideId}`).emit('rideLocationUpdate', {
      rideId: data.rideId,
      lat: data.lat,
      lng: data.lng,
      bearing: data.bearing,
      timestamp: new Date().toISOString(),
    });

    return { status: 'ok' };
  }

  @SubscribeMessage('acceptRide')
  async handleAcceptRide(
    @MessageBody() data: { rideRequestId: string; driverId: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`Driver ${data.driverId} attempting to accept ride ${data.rideRequestId}`);
    return { event: 'rideAccepted', data: { rideRequestId: data.rideRequestId } };
  }

  emitRideOffer(driverId: string, offer: any) {
    if (!this.server) {
      this.logger.warn(`Server not initialized, skipping ride offer to driver ${driverId}`);
      return;
    }
    this.server.to(`user_${driverId}`).emit('rideOffer', offer);
  }

  emitRideUpdate(rideId: string, update: any) {
    if (!this.server) {
      this.logger.warn(`Server not initialized, skipping ride update for ride ${rideId}`);
      return;
    }
    this.server.to(`ride_${rideId}`).emit('rideUpdate', update);
  }
}
