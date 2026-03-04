const pilotService = require("../../services/mobile/pilot.service");

/**
 * Uber-Style Pilot (Driver) Controller
 */

exports.updateLocation = async (req, res) => {
    try {
        const { latitude, longitude, heading, speed } = req.body;
        const pilotId = req.user?.pilot_id; // Injected via auth

        const updated = await pilotService.updatePilotTelemetry(pilotId, {
            latitude,
            longitude,
            heading,
            speed
        });

        return res.json({
            success: true,
            data: updated
        });
    } catch (error) {
        console.error("Update Telemetry Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update location"
        });
    }
};

exports.toggleStatus = async (req, res) => {
    try {
        const { status } = req.body; // 'online' | 'offline' | 'busy'
        const pilotId = req.user?.pilot_id;

        const updated = await pilotService.updateStatus(pilotId, status);

        return res.json({
            success: true,
            status: updated.status,
            message: `Pilot is now ${updated.status}`
        });
    } catch (error) {
        console.error("Toggle Pilot Status Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update status"
        });
    }
};

exports.getAvailableTrips = async (req, res) => {
    try {
        const pilotId = req.user?.pilot_id;
        const { lat, lng } = req.query;

        const trips = await pilotService.findNearbyTrips({
            pilotId,
            location: { lat: parseFloat(lat), lng: parseFloat(lng) }
        });

        return res.json({
            success: true,
            data: trips
        });
    } catch (error) {
        console.error("Get Available Trips Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch nearby missions"
        });
    }
};

exports.acceptTrip = async (req, res) => {
    try {
        const { trip_id } = req.params;
        const pilotId = req.user?.pilot_id;

        const trip = await pilotService.assignPilotToTrip(trip_id, pilotId);

        return res.json({
            success: true,
            data: trip,
            message: "Mission accepted! Safe travels. 🚀"
        });
    } catch (error) {
        console.error("Accept Trip Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to accept mission"
        });
    }
};

exports.getAvailableRides = async (req, res) => {
    try {
        const { type } = req.query;
        const pilotId = req.user?.pilot_id;
        const rides = await pilotService.findNegotiatingTrips(pilotId, type);
        return res.json({
            success: true,
            data: rides
        });
    } catch (error) {
        console.error("Get Available Rides Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch available rides"
        });
    }
};

exports.submitRideBid = async (req, res) => {
    try {
        const { trip_id } = req.params;
        const { amount } = req.body;
        const pilotId = req.user?.pilot_id;

        const updatedTrip = await pilotService.submitBid(trip_id, pilotId, amount);

        return res.json({
            success: true,
            data: updatedTrip,
            message: "Bid submitted successfully! 💰"
        });
    } catch (error) {
        console.error("Submit Ride Bid Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to submit bid"
        });
    }
};

exports.updateTripStatus = async (req, res) => {
    try {
        const { trip_id } = req.params;
        const { status } = req.body; // 'picked_up' | 'completed' | 'cancelled'
        const pilotId = req.user?.pilot_id;

        if (!['picked_up', 'completed', 'cancelled'].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status update" });
        }

        const updatedTrip = await pilotService.updateTripStatus(trip_id, pilotId, status);

        return res.json({
            success: true,
            data: updatedTrip,
            message: `Trip status updated to ${status}`
        });
    } catch (error) {
        console.error("Update Trip Status Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to update trip status"
        });
    }
};
