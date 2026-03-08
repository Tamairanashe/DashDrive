const axios = require('axios');

/**
 * Logistics Engine Service
 * Bridge between DashFood orders and DashDrive core logistics.
 */
class LogisticsEngineService {
    constructor() {
        this.apiUrl = process.env.LOGISTICS_API_URL;
        this.apiKey = process.env.LOGISTICS_API_KEY;
        this.client = axios.create({
            baseURL: this.apiUrl,
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            }
        });
    }

    /**
     * Request a delivery for a DashFood order
     */
    async requestDelivery(order) {
        console.log(`[LogisticsBridge] Converting Order ${order.id} to Delivery Request...`);

        try {
            // 1. Prepare Payload
            // We map Supabase order fields to the DashDrive Direct API schema
            const payload = {
                pickup: {
                    address: order.stores?.address || 'Store Pickup',
                    lat: order.stores?.location_lat,
                    lng: order.stores?.location_lng
                },
                dropoff: {
                    address: order.metadata?.delivery_address || 'Customer Dropoff',
                    lat: -17.82, // Default or parsed from metadata
                    lng: 31.05
                },
                customer: {
                    name: order.customer_name,
                    phone: order.customer_phone || '+263770000000'
                },
                package_size: 'MEDIUM',
                order_reference: order.id,
                vertical: order.type || 'FOOD', // Default to FOOD if not specified
                instructions: order.metadata?.instructions || (order.type === 'DIRECT' ? 'B2B: Handle with care' : 'Standard Delivery')
            };

            // 2. Fire and Forget (or wait for confirmation)
            const response = await this.client.post('/deliveries', payload);

            console.log(`[LogisticsBridge] Successfully booked rider. Delivery ID: ${response.data.delivery_id}`);
            return response.data;
        } catch (error) {
            console.error(`[LogisticsBridge] ❌ Failed to request delivery: ${error.response?.data?.message || error.message}`);
            throw error;
        }
    }

    /**
     * Check delivery status
     */
    async getStatus(deliveryId) {
        try {
            const response = await this.client.get(`/deliveries/${deliveryId}`);
            return response.data;
        } catch (error) {
            console.error(`[LogisticsBridge] ❌ Failed to fetch status: ${error.message}`);
            return null;
        }
    }
}

module.exports = new LogisticsEngineService();
