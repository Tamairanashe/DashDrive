/**
 * Simple offline queue for status updates
 * Stores pending actions when the device is offline
 */

interface QueuedAction {
    orderId: string;
    status: string;
    externalOrderId?: string;
    userId?: string;
    reason?: string;
    timestamp: string;
}

let queue: QueuedAction[] = [];

export const offlineQueue = {
    /**
     * Add a status update to the offline queue
     */
    add(action: QueuedAction) {
        console.log(`[OfflineQueue] Adding order ${action.orderId} status ${action.status} to queue`);
        queue.push(action);
    },

    /**
     * Flush the queue by executing the provided sync function
     */
    async flush(syncFn: (action: QueuedAction) => Promise<any>) {
        if (queue.length === 0) return;

        console.log(`[OfflineQueue] Flushing ${queue.length} pending actions`);
        const pending = [...queue];
        queue = [];

        for (const action of pending) {
            try {
                await syncFn(action);
            } catch (error) {
                console.error(`[OfflineQueue] Failed to sync order ${action.orderId}, re-queueing`, error);
                queue.push(action); // Put it back if it failed
            }
        }
    },

    /**
     * Get the current queue size
     */
    size() {
        return queue.length;
    },

    /**
     * Clear the queue
     */
    clear() {
        queue = [];
    }
};
