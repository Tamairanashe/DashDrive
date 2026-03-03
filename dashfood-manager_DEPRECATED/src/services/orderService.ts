import { api } from "../api";
import { supabase } from "../lib/supabase";

export const orderService = {
    async updateOrderStatus(orderId: string, status: string, externalOrderId?: string, userId?: string, reason?: string) {
        try {
            // ==========================================
            // 🚀 AUTHORITATIVE BACKEND SYNC
            // ==========================================
            // Calling the Node backend ensures NotificationHub triggers (Socket + Push)
            await api.orders.updateStatus(orderId, status, reason);

            return { success: true };
        } catch (error) {
            console.error("Error updating order status:", error);
            return { success: false, error };
        }
    },

    async fetchOrders(storeId: string) {
        if (!storeId) return [];
        const { data, error } = await supabase
            .from("orders")
            .select("*")
            .eq("store_id", storeId)
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data || [];
    },

    async fetchStoreMetrics(storeId: string) {
        if (!storeId) return null;
        const { data, error } = await supabase.rpc('get_store_metrics', {
            p_store_id: storeId
        });

        if (error) throw error;
        return data;
    },

    async fetchOrderItems(orderId: string) {
        const { data, error } = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', orderId);

        if (error) throw error;
        return data || [];
    }
};
