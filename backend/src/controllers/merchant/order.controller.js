const orderService = require('../../services/merchant/order.service');

/**
 * Merchant Order Controller
 */

exports.getActiveOrders = async (req, res) => {
    try {
        const { store_id } = req.params;
        const orders = await orderService.getStoreOrders(store_id);
        return res.json({ success: true, data: orders });
    } catch (error) {
        console.error("Get Orders Error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateMerchantStatus = async (req, res) => {
    try {
        const { order_id } = req.params;
        const { status } = req.body; // 'accepted' | 'ready'

        let updatedOrder;
        if (status === 'accepted') {
            updatedOrder = await orderService.acceptOrder(order_id);
        } else if (status === 'ready') {
            updatedOrder = await orderService.markOrderReady(order_id);
            await orderService.notifyDispatch(updatedOrder);
        } else {
            return res.status(400).json({ success: false, message: "Invalid merchant status update" });
        }

        return res.json({ success: true, data: updatedOrder });
    } catch (error) {
        console.error("Merchant Status Update Error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};
