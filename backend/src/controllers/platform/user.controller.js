const platformUser = require('../../services/platform/platformUser.service');

/**
 * Platform User & Support Controller
 */

exports.getUserStats = async (req, res) => {
    try {
        const stats = await platformUser.getGlobalUserStats();
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch user stats"
        });
    }
};

exports.getSupportTickets = async (req, res) => {
    try {
        const tickets = await platformUser.getPlatformTickets();
        const overview = await platformUser.getSupportOverview();
        res.json({
            success: true,
            data: {
                tickets,
                overview
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch support data"
        });
    }
};
