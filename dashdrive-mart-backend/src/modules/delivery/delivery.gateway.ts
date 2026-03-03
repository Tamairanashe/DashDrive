import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
    namespace: 'delivery',
})
export class DeliveryGateway {
    @WebSocketServer()
    server: Server;

    emitRiderAssigned(orderId: string, rider: any) {
        this.server.to(`order_${orderId}`).emit('rider_assigned', rider);
    }

    emitDeliveryUpdate(orderId: string, status: string) {
        this.server.to(`order_${orderId}`).emit('delivery_update', { status });
    }

    @SubscribeMessage('join_order_tracking')
    handleJoinOrder(@MessageBody() data: { orderId: string }, client: any) {
        client.join(`order_${data.orderId}`);
        return { event: 'joined', orderId: data.orderId };
    }
}
