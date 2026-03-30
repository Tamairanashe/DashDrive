const fleetService = require('../../services/platform/fleet.service');

/**
 * Platform Fleet Controller
 */

exports.getOverview = async (req, res) => {
    try {
        const overview = await fleetService.getFleetOverview();
        res.json({
            success: true,
            data: overview
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch fleet overview"
        });
    }
};

exports.getVehicleLogic = async (req, res) => {
    try {
        const attributes = await fleetService.getVehicleAttributes();
        res.json({
            success: true,
            data: attributes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch vehicle logic"
        });
    }
};

exports.getLiveFleet = async (req, res) => {
    try {
        const fleet = await fleetService.getLiveFleetStatus();
        res.json({
            success: true,
            data: fleet
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch live fleet"
        });
    }
};
