const platformAnalytics = require('../../services/platform/platformAnalytics.service');

/**
 * SuperApp Dashboard Controller
 */

exports.getPlatformStats = async (req, res) => {
    try {
        const stats = await platformAnalytics.getPlatformKPIs();
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch platform stats",
            error: error.message
        });
    }
};

exports.getServiceOverview = async (req, res) => {
    try {
        const metrics = await platformAnalytics.getServiceMetrics();
        res.json({
            success: true,
            data: metrics
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch service overview",
            error: error.message
        });
    }
};

exports.getFleetStatus = async (req, res) => {
    try {
        // Placeholder for real-time fleet density/health
        res.json({
            success: true,
            data: {
                total_drivers: 15200,
                online: 12402,
                offline: 2656,
                suspended: 142
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch fleet status"
        });
    }
};
