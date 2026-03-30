import { io, Socket } from 'socket.io-client';
import { create } from 'zustand';

interface SocketState {
    socket: Socket | null;
    isConnected: boolean;
    connect: (riderId: string) => void;
    disconnect: () => void;
}

// Note: In a real environment, this would come from an ENV variable or config
const SOCKET_URL = 'http://localhost:3001'; // Logistics Engine Port
const SOCKET_PATH = '/api/v1/dispatch/ws';

export const useSocketStore = create<SocketState>((set, get) => ({
    socket: null,
    isConnected: false,
    connect: (riderId: string) => {
        if (get().socket?.connected) return;

        const socket = io(SOCKET_URL, {
            path: SOCKET_PATH,
            query: { riderId },
            transports: ['websocket'],
        });

        socket.on('connect', () => {
            console.log('📡 Connected to Dispatch Socket');
            set({ isConnected: true });
        });

        socket.on('disconnect', () => {
            console.log('📡 Disconnected from Dispatch Socket');
            set({ isConnected: false });
        });

        set({ socket });
    },
    disconnect: () => {
        get().socket?.disconnect();
        set({ socket: null, isConnected: false });
    },
}));
