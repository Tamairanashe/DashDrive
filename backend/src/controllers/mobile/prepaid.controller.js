const prepaidService = require('../../services/mobile/prepaid.service');

/**
 * Prepaid Rides Controller
 */

exports.getAvailablePackages = async (req, res) => {
    try {
        const packages = await prepaidService.getPackages();
        return res.json({
            success: true,
            data: packages
        });
    } catch (error) {
        console.error("Get Packages Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch prepaid packages"
        });
    }
};

exports.purchasePackage = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { package_id } = req.body;

        if (!package_id) {
            return res.status(400).json({ success: false, message: "Package ID is required" });
        }

        const result = await prepaidService.purchasePackage(userId, package_id);

        return res.json(result);
    } catch (error) {
        console.error("Purchase Package Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to purchase package"
        });
    }
};
