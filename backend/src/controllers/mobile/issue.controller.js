const issueService = require('../../services/mobile/issue.service');

/**
 * Support & Issue Management Controller
 */

exports.reportNewIssue = async (req, res) => {
    try {
        const { orderId, type, severity, notes } = req.body;

        if (!orderId || !type || !severity) {
            return res.status(400).json({ success: false, message: "Missing required issue fields" });
        }

        const issue = await issueService.reportIssue({ orderId, type, severity, notes });

        return res.json({
            success: true,
            data: issue
        });
    } catch (error) {
        console.error("Report Issue Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to report issue"
        });
    }
};

exports.fetchOrderIssues = async (req, res) => {
    try {
        const { order_id } = req.params;
        const issues = await issueService.getOrderIssues(order_id);

        return res.json({
            success: true,
            data: issues
        });
    } catch (error) {
        console.error("Fetch Order Issues Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch issues"
        });
    }
};
