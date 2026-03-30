import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GeoService } from '../geo/geo.service';
import { DispatchService } from './dispatch.service';
import { Logger, forwardRef, Inject } from '@nestjs/common';

@WebSocketGateway({
  cors: { origin: '*' },
  path: '/api/v1/dispatch/ws',
})
export class DispatchGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(DispatchGateway.name);

  constructor(
    private readonly geoService: GeoService,
    @Inject(forwardRef(() => DispatchService))
    private readonly dispatchService: DispatchService,
  ) {}

  handleConnection(client: Socket) {
    const riderId = client.handshake.query.riderId as string;
    if (riderId) {
      client.join(`rider_${riderId}`);
      this.logger.log(`📡 Rider ${riderId} connected to Dispatch Socket`);
    }
  }

  @SubscribeMessage('location_update')
  async handleLocationUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { lat: number; lng: number },
  ) {
    const riderId = client.handshake.query.riderId as string;
    if (riderId && data.lat && data.lng) {
      await this.geoService.updateRiderLocation(riderId, data.lat, data.lng);
      // Optionally update Rider DB record if needed
    }
  }

  @SubscribeMessage('delivery_response')
  async handleDeliveryResponse(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { attemptId: string; accept: boolean },
  ) {
    const riderId = client.handshake.query.riderId as string;
    if (riderId && data.attemptId) {
      await this.dispatchService.handleRiderResponse(
        data.attemptId,
        riderId,
        data.accept,
      );
    }
  }

  emitDeliveryRequest(riderId: string, deliveryData: any) {
    this.server.to(`rider_${riderId}`).emit('delivery_request', deliveryData);
  }

  emitBroadcast(event: string, data: any) {
    this.server.emit(event, data);
  }

  emitDemandNudge(riderId: string, message: string) {
    this.server.to(`rider_${riderId}`).emit('demand_nudge', { message });
  }
}
