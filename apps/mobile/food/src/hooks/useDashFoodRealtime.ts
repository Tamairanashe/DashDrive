import { useEffect } from "react";
import { socketService } from "../lib/socket";
import { useOrderStore } from "../store/useOrderStore";
import { notificationService } from "../services/notificationService";
import { useAudioPlayer } from "expo-audio";
import { supabase } from "../lib/supabase";
import { useStoreSettings } from "../store/useStoreSettings";
import { orderService } from "../services/orderService";
import { storeService } from "../services/storeService";
import { offlineQueue } from "../services/offlineQueue";

/**
 * High-level hook to manage all real-time order events (Socket.io + Supabase Fallback)
 */
export const useDashFoodRealtime = (storeId?: string) => {
    const { addOrder, updateOrder, setIncomingOrder } = useOrderStore();
    const player = useAudioPlayer(require("../../assets/sounds/new-order.mp3"));

    useEffect(() => {
        if (!storeId) return;

        // 0. Load store-specific settings (Acceptance Mode, etc.)
        storeService.fetchStoreSettings(storeId);

        // 1. Offline Queue Flushing (On initialization and reconnection)
        const flushOfflineUpdates = async () => {
            await offlineQueue.flush(async (action) => {
                await orderService.updateOrderStatus(
                    action.orderId,
                    action.status,
                    action.externalOrderId,
                    action.userId,
                    action.reason
                );
            });
        };

        flushOfflineUpdates();

        // 2. Socket.io Connection (Primary Realtime)
        socketService.connect();
        socketService.joinStore(storeId);

        socketService.on("newIncomingOrder", async (payload: any) => {
            console.log("Realtime (Socket): New order", payload.id);
            const { acceptanceMode } = useStoreSettings.getState();

            if (acceptanceMode === "auto") {
                // Enterprise Auto-Accept Flow
                console.log("Auto-accepting order", payload.id);
                addOrder({ ...payload, status: "in_progress" });
                await orderService.updateOrderStatus(payload.id, "in_progress", payload.external_order_id);
            } else {
                // Manual Flow
                addOrder(payload);
                setIncomingOrder(payload);
                playNewOrderSound();
            }

            notificationService.showLocalNotification(
                "New Order Received! 🍱",
                `Order for ${payload.customer_name} of $${payload.total_amount?.toFixed(2)}`
            );
        });

        socketService.on("orderStatusChanged", (payload: any) => {
            console.log("Realtime (Socket): Status changed", payload.id, payload.status);
            updateOrder(payload);
        });

        // 2. Supabase Realtime (Redundant Fallback / Other Data)
        const filter = `store_id=eq.${storeId}`;
        const channel = supabase
            .channel(`store-${storeId}-orders`)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "orders",
                    filter,
                },
                (payload) => {
                    // Only process if we haven't seen this version yet (simplified deduping by Zustand logic)
                    if (payload.eventType === "INSERT") {
                        addOrder(payload.new as any);
                    } else if (payload.eventType === "UPDATE") {
                        updateOrder(payload.new as any);
                    }
                }
            )
            .subscribe();

        return () => {
            socketService.off("newIncomingOrder");
            socketService.off("orderStatusChanged");
            supabase.removeChannel(channel);
        };
    }, [storeId, addOrder, updateOrder]);

    const playNewOrderSound = () => {
        try {
            if (player) {
                player.play();
            }
        } catch (error) {
            console.log("Audio Alert Error:", error);
        }
    };
};
