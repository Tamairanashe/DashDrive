import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { LocalRidesService } from './local-rides.service';
import { CreateLocalRideRequestDto, CreateLocalOfferDto, DriverLocationDto } from './dto/local-rides.dto';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'rides',
})
export class LocalRidesGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly ridesService: LocalRidesService) {}

  @SubscribeMessage('request_ride')
  async handleRequestRide(
    @MessageBody() dto: CreateLocalRideRequestDto,
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.handshake.query.userId as string;
    const request = await this.ridesService.createRideRequest(userId, dto);
    
    // Broadcast to nearby drivers (simplified broadcast for MVP)
    this.server.emit('new_ride_request', request);
    
    // Join a room for this specific ride
    client.join(`ride_${request.id}`);
    
    return { status: 'success', requestId: request.id };
  }

  @SubscribeMessage('submit_offer')
  async handleSubmitOffer(
    @MessageBody() dto: CreateLocalOfferDto,
    @ConnectedSocket() client: Socket,
  ) {
    const driverId = client.handshake.query.userId as string;
    const offer = await this.ridesService.createOffer(driverId, dto);
    
    // Notify the passenger
    this.server.to(`ride_${dto.requestId}`).emit('offer_received', offer);
    
    return { status: 'success', offerId: offer.id };
  }

  @SubscribeMessage('update_location')
  handleLocationUpdate(@MessageBody() dto: DriverLocationDto, @ConnectedSocket() client: Socket) {
    const driverId = client.handshake.query.userId as string;
    // In production, update Redis GEO
    this.server.emit('driver_moved', { driverId, ...dto });
  }
}
