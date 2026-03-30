const riderService = require("../../services/mobile/rider.service");

/**
 * Uber-Style Rider (Customer) Controller
 */

exports.searchMarketplace = async (req, res) => {
    try {
        const { q, category, type, lat, lng } = req.query;

        const results = await riderService.searchStores(q, {
            category,
            type,
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
        const userId = req.user?.id;

        const order = await riderService.processMobileOrder({
            userId,
            storeId: store_id,
            organizationId: organization_id,
            items,
            totalAmount: total_amount,
            deliveryAddress: delivery_address,
            type: req.body.type
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

exports.requestRide = async (req, res) => {
    try {
        const { origin, destination, initial_offer } = req.body;
        const userId = req.user?.id;

        const trip = await riderService.requestRide({
            userId,
            origin,
            destination,
            initialOffer: initial_offer
        });

        return res.json({
            success: true,
            data: trip,
            message: "Ride request broadcasted! Waiting for bids... 🚗"
        });
    } catch (error) {
        console.error("Request Ride Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to request ride"
        });
    }
};

exports.requestParcel = async (req, res) => {
    try {
        const { origin, destination, initial_offer, metadata } = req.body;
        const userId = req.user?.id;

        const trip = await riderService.requestParcel({
            userId,
            origin,
            destination,
            initialOffer: initial_offer,
            metadata: metadata || {}
        });

        return res.json({
            success: true,
            data: trip,
            message: "Parcel delivery request broadcasted! 📦"
        });
    } catch (error) {
        console.error("Request Parcel Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to request parcel delivery"
        });
    }
};
