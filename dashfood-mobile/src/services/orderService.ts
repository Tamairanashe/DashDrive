import api from "../lib/api";
import { auditLogService } from "./auditLogService";
import { offlineQueue } from "./offlineQueue";

export const orderService = {
    /**
   * Update order status in Logistics Engine
   */
    async updateOrderStatus(orderId: string, status: string, externalOrderId?: string, userId?: string, reason?: string) {
        try {
            // Check connectivity
            const isOnline = true; // TODO: Wire this to NetInfo

            if (!isOnline) {
                const timestamp = new Date().toISOString();
                offlineQueue.add({
                    orderId,
                    status,
                    externalOrderId,
                    userId,
                    reason,
                    timestamp
                });
                return { success: true, offline: true };
            }

            const response = await api.patch(`/orders/${orderId}/status`, {
                status,
                note: reason
            });

            return { success: true, data: response.data };
        } catch (error) {
            console.error("Error updating order status:", error);
            return { success: false, error };
        }
    },

    async fetchOrders(storeId: string) {
        try {
            const response = await api.get(`/orders/store/${storeId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching orders:", error);
            throw error;
        }
    },

    /**
     * Fetch store metrics for the dashboard
     */
    async fetchStoreMetrics(storeId: string) {
        try {
            // Fallback for now if stats endpoint isn't fully ready
            const response = await api.get(`/orders/store/${storeId}/stats`);
            return response.data;
        } catch (error) {
            console.error("Error fetching store metrics:", error);
            // Return dummy data to keep UI alive during transition if needed
            return {
                total_orders: 0,
                total_revenue: 0,
                pending_orders: 0
            };
        }
    },

    /**
     * Fetch items for a specific order
     */
    async fetchOrderItems(orderId: string) {
        try {
            const response = await api.get(`/orders/${orderId}`);
            return response.data.items;
        } catch (error) {
            console.error("Error fetching order items:", error);
            throw error;
        }
    }
};
