const supabase = require('../../config/supabase');
const dispatchService = require('../common/dispatch.service');

/**
 * Merchant Order Operations Service
 */

/**
 * Helper to log status history
 */
async function logStatusHistory(orderId, status, note = null) {
    await supabase.from('order_status_history').insert({
        order_id: orderId,
        status,
        note
    });
}

/**
 * Fetch all active orders for a specific store.
 */
exports.getStoreOrders = async (storeId) => {
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};

/**
 * Merchant action: Accept an incoming order.
 */
exports.acceptOrder = async (orderId) => {
    const { data, error } = await supabase
        .from('orders')
        .update({
            status: 'preparing', // Standardized from 'in_progress'
            accepted_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select()
        .single();

    if (error) throw error;

    await logStatusHistory(orderId, 'preparing', 'Merchant accepted and started preparation');
    return data;
};

/**
 * Merchant action: Mark order as prepared and ready for pilot pickup.
 */
exports.markOrderReady = async (orderId) => {
    const { data, error } = await supabase
        .from('orders')
        .update({
            status: 'ready',
            ready_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select()
        .single();

    if (error) throw error;

    await logStatusHistory(orderId, 'ready', 'Order is ready for pickup');

    // Automatically trigger dispatch via the central DashDrive Logistics Engine
    try {
        const logisticsEngineService = require('../common/logisticsEngineService');

        // Fetch full order with store details for the logistics payload
        const { data: fullOrder, error: fetchErr } = await supabase
            .from('orders')
            .select('*, stores(*)')
            .eq('id', orderId)
            .single();

        if (fetchErr) throw fetchErr;

        const deliveryResult = await logisticsEngineService.requestDelivery(fullOrder);

        await logStatusHistory(
            orderId,
            'assigned',
            `Logistics Engine assigned rider. External ID: ${deliveryResult.delivery_id}`
        );

    } catch (dispatchErr) {
        console.error("[Logistics Dispatch Error]", dispatchErr.message);
        await logStatusHistory(orderId, 'dispatch_error', `Failed to request rider: ${dispatchErr.message}`);
    }

    return data;
};

/**
 * Integration: Trigger Dispatch for a "Ready" order.
 */
exports.notifyDispatch = async (order) => {
    console.log(`[Merchant Dispatch] Order ${order.id} is ready for pickup at store ${order.store_id}`);
};
