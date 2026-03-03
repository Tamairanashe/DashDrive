import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    cors: { origin: '*' },
    path: '/api/v1/orders/ws'
})
export class OrdersGateway implements OnGatewayConnection {
    @WebSocketServer()
    server: Server;

    handleConnection(client: Socket) {
        const storeId = client.handshake.query.storeId as string;
        if (storeId) {
            client.join(`store_${storeId}`);
            console.log(`📡 Socket connected to store room: store_${storeId}`);
        }
    }

    emitNewOrder(storeId: string, order: any) {
        this.server.to(`store_${storeId}`).emit('new_order', order);
    }

    emitStatusUpdate(storeId: string, order: any) {
        this.server.to(`store_${storeId}`).emit('order_status_updated', order);
    }
}
