import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useOrderStore } from "../store/useOrderStore";
import { notificationService } from "../services/notificationService";

export const useRealtimeOrders = (storeId?: string) => {
    const { addOrder, updateOrder } = useOrderStore();

    useEffect(() => {
        // 1. Subscribe to order changes in Supabase
        const filter = storeId ? `store_id=eq.${storeId}` : undefined;

        const channel = supabase
            .channel("orders-live")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "orders",
                    filter,
                },
                (payload) => {
                    console.log("Realtime update received:", payload);

                    if (payload.eventType === "INSERT") {
                        addOrder(payload.new as any);
                        notificationService.showLocalNotification(
                            "New Order Received! 🍱",
                            `Order for ${payload.new.customer_name} of $${payload.new.total_amount?.toFixed(2)}`
                        );
                    } else if (payload.eventType === "UPDATE") {
                        updateOrder(payload.new as any);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [storeId, addOrder, updateOrder]);
};
