import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { notification } from 'antd';

interface AdminSocketState {
    socket: Socket | null;
    isConnected: boolean;
    alerts: any[];
    connect: () => void;
    disconnect: () => void;
}

export const useAdminSocketStore = create<AdminSocketState>((set, get) => ({
    socket: null,
    isConnected: false,
    alerts: [],

    connect: () => {
        if (get().socket?.connected) return;

        const socket = io('http://localhost:8000', {
            transports: ['websocket'],
            reconnection: true,
        });

        socket.on('connect', () => {
            console.log('[AdminSocket] Connected');
            set({ isConnected: true });
            socket.emit('join', 'admin'); // Join global admin room
        });

        socket.on('disconnect', () => {
            console.log('[AdminSocket] Disconnected');
            set({ isConnected: false });
        });

        socket.on('newIssue', (issue) => {
            console.log('[AdminSocket] New SLA/Operational Alert:', issue);
            
            // Add to local state
            set((state) => ({
                alerts: [issue, ...state.alerts].slice(0, 50)
            }));

            // Show AntD notification
            notification.warning({
                message: `SLA Alert: ${issue.order_type || 'Order'}`,
                description: issue.resolution_notes || `Issue detected for ${issue.store_name}`,
                placement: 'topRight',
                duration: 5,
            });
        });

        set({ socket });
    },

    disconnect: () => {
        get().socket?.disconnect();
        set({ socket: null, isConnected: false });
    }
}));
