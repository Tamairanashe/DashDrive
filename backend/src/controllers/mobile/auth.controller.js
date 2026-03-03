const authService = require("../../services/mobile/auth.service");

/**
 * Unified Mobile Authentication Controller
 */

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await authService.authenticateMobileUser(email, password);

        return res.json({
            success: true,
            ...result
        });
    } catch (error) {
        console.error("Mobile Login Error:", error);
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Authentication failed"
        });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const userId = req.user?.id;
        const profile = await authService.getUserProfile(userId);

        return res.json({
            success: true,
            data: profile
        });
    } catch (error) {
        console.error("Get Profile Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch profile"
        });
    }
};
