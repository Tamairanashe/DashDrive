const axios = require('axios');

/**
 * Logistics Inventory Sync Service
 * Notifies the Logistics Engine about merchant inventory changes.
 */
class LogisticsInventoryService {
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

    async syncInventory(itemId, isAvailable) {
        console.log(`[InventoryBridge] Syncing item ${itemId} (Available: ${isAvailable}) to Logistics Engine...`);

        try {
            await this.client.post('/inventory/sync', {
                item_id: itemId,
                is_available: isAvailable,
                timestamp: new Date()
            });
            console.log(`[InventoryBridge] 🟢 Sync successful for item ${itemId}`);
        } catch (error) {
            console.error(`[InventoryBridge] ❌ Failed to sync: ${error.response?.data?.message || error.message}`);
            // We don't throw here to avoid blocking the CMS update, 
            // but in production we might queue this for retry.
        }
    }
}

module.exports = new LogisticsInventoryService();
