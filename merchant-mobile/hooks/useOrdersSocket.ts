import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from './useToast';

const SOCKET_URL = 'http://localhost:3001'; // Same as API_URL
const SOCKET_PATH = '/api/v1/orders/ws';

export function useOrdersSocket() {
    const { store, merchant } = useAuth();
    const socketRef = useRef<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        if (!merchant || !store) return;

        // Initialize socket
        socketRef.current = io(SOCKET_URL, {
            path: SOCKET_PATH,
            query: { storeId: store.id },
            transports: ['websocket'],
        });

        const socket = socketRef.current;

        socket.on('connect', () => {
            console.log('📡 Orders socket connected');
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            console.log('📡 Orders socket disconnected');
            setIsConnected(false);
        });

        socket.on('new_order', (order) => {
            console.log('🔔 New order received via socket:', order);
            showToast('New Order Received!', 'success');
            // Trigger local data refresh if needed
        });

        socket.on('order_status_updated', (order) => {
            console.log('🔄 Order status updated via socket:', order);
            showToast(`Order #${order.orderNumber} is now ${order.status}`, 'info');
        });

        socket.on('connect_error', (error) => {
            console.error('📡 Socket connection error:', error);
        });

        return () => {
            socket.disconnect();
        };
    }, [merchant, store]);

    return { isConnected };
}
