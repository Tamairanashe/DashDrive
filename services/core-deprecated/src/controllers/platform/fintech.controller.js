const fintechService = require('../../services/platform/fintech.service');

/**
 * Platform Fintech Controller
 */

exports.getSummary = async (req, res) => {
    try {
        const summary = await fintechService.getFintechSummary();
        res.json({
            success: true,
            data: summary
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch fintech summary"
        });
    }
};

exports.listTransactions = async (req, res) => {
    try {
        const transactions = await fintechService.getTransactions(req.query);
        res.json({
            success: true,
            data: transactions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch transactions"
        });
    }
};

exports.listWithdrawRequests = async (req, res) => {
    try {
        const requests = await fintechService.getWithdrawRequests();
        res.json({
            success: true,
            data: requests
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch withdraw requests"
        });
    }
};
