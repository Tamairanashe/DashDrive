const riderService = require("../../services/mobile/rider.service");

/**
 * Uber-Style Rider (Customer) Controller
 */

exports.searchMarketplace = async (req, res) => {
    try {
        const { query, category, lat, lng } = req.query;

        const results = await riderService.searchStores(query, {
            category,
            location: lat && lng ? { lat: parseFloat(lat), lng: parseFloat(lng) } : null
        });

        return res.json({
            success: true,
            data: results
        });
    } catch (error) {
        console.error("Search Marketplace Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to search marketplace"
        });
    }
};

exports.getStoreDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const store = await riderService.getStoreWithMenu(id);

        return res.json({
            success: true,
            data: store
        });
    } catch (error) {
        console.error("Get Store Details Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch store details"
        });
    }
};

exports.createOrder = async (req, res) => {
    try {
        const { store_id, organization_id, items, total_amount, delivery_address } = req.body;
        const userId = req.user?.id; // Injected by auth middleware

        const order = await riderService.processMobileOrder({
            userId,
            storeId: store_id,
            organizationId: organization_id,
            items,
            totalAmount: total_amount,
            deliveryAddress: delivery_address
        });

        return res.json({
            success: true,
            data: order,
            message: "Order placed successfully! 🏁"
        });
    } catch (error) {
        console.error("Create Mobile Order Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to place order"
        });
    }
};

exports.getActiveOrders = async (req, res) => {
    try {
        const userId = req.user?.id;
        const orders = await riderService.getRiderActiveOrders(userId);

        return res.json({
            success: true,
            data: orders
        });
    } catch (error) {
        console.error("Get Active Orders Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch active orders"
        });
    }
};
