import io from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';

class CityWebSocketService {
    private socket: any;

    connect() {
        this.socket = io(SOCKET_URL);
        return this.socket;
    }

    joinRide(rideId: string) {
        this.socket.emit('join_ride', rideId);
    }

    onOfferCreated(callback: (data: any) => void) {
        this.socket.on('offer_created', callback);
    }

    disconnect() {
        if (this.socket) this.socket.disconnect();
    }
}

export const citySocketService = new CityWebSocketService();
