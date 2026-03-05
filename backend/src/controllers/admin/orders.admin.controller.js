const ordersAdminService = require("../../services/admin/orders.admin.service");

/**
 * Uber-Style Orders Controller
 */
exports.listOrders = async (req, res) => {
    try {
        const {
            store_id,
            status,
            search,
            start_date,
            end_date,
            page,
            limit
        } = req.query;

        const organizationId = req.headers["x-organization-id"]; // From portal context

        const result = await ordersAdminService.getOrders({
            organizationId,
            storeId: store_id,
            status,
            search,
            startDate: start_date,
            endDate: end_date,
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 20
        });

        return res.json({
            success: true,
            ...result
        });
    } catch (error) {
        console.error("List Orders Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch orders"
        });
    }
};

exports.getOrderDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await ordersAdminService.getOrderDetails(id);

        return res.json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error("Order Details Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch order details"
        });
    }
};

exports.resolveIssue = async (req, res) => {
    try {
        const { id } = req.params;
        const { notes } = req.body;

        const resolved = await ordersAdminService.resolveIssue(id, notes);

        return res.json({
            success: true,
            data: resolved,
            message: "Issue resolved successfully"
        });
    } catch (error) {
        console.error("Resolve Issue Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to resolve issue"
        });
    }
};

exports.processRefund = async (req, res) => {
    // Stub for enterprise-grade refund logic
    return res.json({
        success: true,
        message: "Refund request initiated (Mocked)"
    });
};

exports.updateStatus = async (req, res) => {
    const { id } = req.params;
    const { status, reason } = req.body;
    const supabase = require('../../config/supabase');
    const notificationHub = require('../../services/notificationHub');

    try {
        const updateData = {
            status,
            updated_at: new Date()
        };

        if (status === 'in_progress') updateData.accepted_at = new Date();
        if (status === 'ready') updateData.ready_at = new Date();
        if (status === 'completed') updateData.completed_at = new Date();

        const { data: updatedOrder, error } = await supabase
            .from('orders')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        await notificationHub.notifyOrderStatusChange(updatedOrder, reason);

        // ==========================================
        // 🚀 LOGISTICS ENGINE INTEGRATION
        // ==========================================
        if (status === 'ready') {
            try {
                const logisticsEngineService = require('../../services/common/logisticsEngineService');

                // Fetch full order with store details for the logistics payload
                const { data: fullOrder } = await supabase
                    .from('orders')
                    .select('*, stores(*)')
                    .eq('id', id)
                    .single();

                await logisticsEngineService.requestDelivery(fullOrder);

                // Log to history for audit
                await supabase.from('order_status_history').insert({
                    order_id: id,
                    status: 'assigned',
                    note: 'Logistics Engine notified of READY order'
                });
            } catch (dispatchErr) {
                console.error("[Logistics Dispatch Error]", dispatchErr.message);
            }
        }

        return res.json({
            success: true,
            data: updatedOrder
        });
    } catch (error) {
        console.error("Update Order Status Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update order status"
        });
    }
};
