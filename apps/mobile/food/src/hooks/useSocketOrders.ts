import { useEffect } from "react";
import { socketService } from "../lib/socket";
import { useOrderStore } from "../store/useOrderStore";
import { notificationService } from "../services/notificationService";
import { useAudioPlayer } from "expo-audio";

export const useSocketOrders = (storeId?: string) => {
    const { addOrder, updateOrder, setIncomingOrder } = useOrderStore();
    const player = useAudioPlayer(require("../../assets/sounds/new-order.mp3"));

    useEffect(() => {
        if (!storeId) return;

        // 1. Connect and Join Room
        socketService.connect();
        socketService.joinStore(storeId);

        // 2. Listen for New Orders (Socket.io)
        socketService.on("newIncomingOrder", (payload: any) => {
            console.log("Socket: New order received", payload);

            // Add to local state instantly
            addOrder(payload);

            // Trigger the "Command Center" popup
            setIncomingOrder(payload);

            // Play sound alert
            playNewOrderSound();

            // Show notification
            notificationService.showLocalNotification(
                "New Order Received! 🍱",
                `Order for ${payload.customer_name} of $${payload.total_amount?.toFixed(2)}`
            );
        });

        // 3. Listen for Order Updates (Socket.io)
        socketService.on("orderStatusChanged", (payload: any) => {
            console.log("Socket: Order updated", payload);
            updateOrder(payload);
        });

        return () => {
            socketService.off("newIncomingOrder");
            socketService.off("orderStatusChanged");
        };
    }, [storeId, addOrder, updateOrder]);

    const playNewOrderSound = () => {
        try {
            if (player) {
                player.play();
            }
        } catch (error) {
            console.log("Error playing sound (likely missing asset):", error);
        }
    };
};
