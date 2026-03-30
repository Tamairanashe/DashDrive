import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'city-to-city',
})
export class CityToCityGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('CityToCityGateway');

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRide')
  handleJoinRide(client: Socket, rideId: string) {
    client.join(`ride_${rideId}`);
    return { event: 'joined', data: rideId };
  }

  notifyPassengerNewOffer(rideId: string, offer: any) {
    this.server.to(`ride_${rideId}`).emit('offer.created', offer);
  }

  notifyDriverOfferAccepted(driverId: string, data: any) {
    this.server.emit(`driver_${driverId}_accepted`, data);
  }

  broadcastNewRideRequest(routeId: string, ride: any) {
    // Notify all drivers interested in this route
    this.server.emit(`route_${routeId}_new_request`, ride);
  }

  notifyTripUpdate(rideId: string, status: string, details?: any) {
    this.server.to(`ride_${rideId}`).emit('trip.updated', { status, ...details });
  }
}
