const paymentService = require('../../services/mobile/payment.service');

/**
 * Payment & Wallet Controller
 */

exports.getWalletInfo = async (req, res) => {
    try {
        const userId = req.user?.id;
        const wallet = await paymentService.getWallet(userId);
        const transactions = await paymentService.getTransactionHistory(wallet.id);

        return res.json({
            success: true,
            data: {
                wallet,
                transactions
            }
        });
    } catch (error) {
        console.error("Get Wallet Info Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch wallet information"
        });
    }
};

exports.requestPayout = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ success: false, message: "Invalid amount" });
        }

        const payout = await paymentService.requestPayout(userId, amount);

        return res.json({
            success: true,
            data: payout,
            message: "Payout request submitted successfully! 💸"
        });
    } catch (error) {
        console.error("Request Payout Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to request payout"
        });
    }
};
