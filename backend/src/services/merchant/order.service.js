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

    // Automatically trigger dispatch
    try {
        const bestPilot = await dispatchService.findBestPilotForOrder(orderId);
        if (bestPilot) {
            await dispatchService.assignPilot(orderId, bestPilot.id);
            await logStatusHistory(orderId, 'assigned', `Pilot ${bestPilot.name} assigned for delivery`);
        } else {
            await logStatusHistory(orderId, 'pending_dispatch', 'No pilots available in the area right now');
        }
    } catch (dispatchErr) {
        console.error("[Dispatch Error]", dispatchErr.message);
    }

    return data;
};

/**
 * Integration: Trigger Dispatch for a "Ready" order.
 */
exports.notifyDispatch = async (order) => {
    console.log(`[Merchant Dispatch] Order ${order.id} is ready for pickup at store ${order.store_id}`);
};
