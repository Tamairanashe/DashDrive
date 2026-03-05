import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from '../../common/guards/ws-jwt.guard';

@WebSocketGateway({
    cors: { origin: '*' },
    namespace: 'pricing',
})
export class PricingGateway {
    @WebSocketServer()
    server: Server;

    broadcastOffer(offerId: string, riderIds: string[], offerDetails: any) {
        riderIds.forEach((riderId) => {
            this.server.to(`rider_${riderId}`).emit('new_delivery_offer', offerDetails);
        });
    }

    emitNewBid(offerId: string, bid: any) {
        this.server.to(`offer_${offerId}`).emit('new_bid', bid);
    }

    emitOfferAccepted(offerId: string, assignment: any) {
        this.server.to(`offer_${offerId}`).emit('offer_accepted', assignment);
    }

    @SubscribeMessage('join_offer_room')
    handleJoinOffer(
        @MessageBody() data: { offerId: string },
        @ConnectedSocket() client: Socket,
    ) {
        client.join(`offer_${data.offerId}`);
        return { event: 'joined', offerId: data.offerId };
    }

    @SubscribeMessage('join_rider_room')
    handleJoinRider(
        @MessageBody() data: { riderId: string },
        @ConnectedSocket() client: Socket,
    ) {
        client.join(`rider_${data.riderId}`);
        return { event: 'joined', riderId: data.riderId };
    }
}
