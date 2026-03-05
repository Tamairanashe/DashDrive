import { io, Socket } from "socket.io-client";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || "http://localhost:3000";

class SocketService {
    private socket: Socket | null = null;
    private isConnected: boolean = false;

    connect() {
        if (this.socket) return;

        this.socket = io(BACKEND_URL, {
            transports: ["websocket"],
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
        });

        this.socket.on("connect", () => {
            this.isConnected = true;
            console.log("Connected to Real-Time Socket Server");
        });

        this.socket.on("disconnect", () => {
            this.isConnected = false;
            console.log("Disconnected from Socket Server");
        });

        this.socket.on("connect_error", (error) => {
            console.error("Socket Connection Error:", error);
        });
    }

    joinStore(storeId: string) {
        if (this.socket) {
            this.socket.emit("join_store", storeId);
            console.log(`Joined store room: ${storeId}`);
        }
    }

    on(event: string, callback: (data: any) => void) {
        if (this.socket) {
            this.socket.on(event, callback);
        }
    }

    off(event: string) {
        if (this.socket) {
            this.socket.off(event);
        }
    }

    emit(event: string, data: any) {
        if (this.socket) {
            this.socket.emit(event, data);
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.isConnected = false;
        }
    }
}

export const socketService = new SocketService();
