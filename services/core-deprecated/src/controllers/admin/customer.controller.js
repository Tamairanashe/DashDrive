const customerService = require("../../services/admin/customer.service");

/**
 * Uber-Style Customer & Feedback Controller
 */

// --- Customers ---

exports.listCustomers = async (req, res) => {
    try {
        const organizationId = req.headers["x-organization-id"];
        const { store_id, min_orders, min_spent } = req.query;

        const customers = await customerService.getCustomers(organizationId, {
            storeId: store_id,
            minOrders: min_orders,
            minSpent: min_spent
        });

        return res.json({
            success: true,
            data: customers
        });
    } catch (error) {
        console.error("List Customers Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch customers"
        });
    }
};

// --- Groups ---

exports.listGroups = async (req, res) => {
    try {
        const organizationId = req.headers["x-organization-id"];
        const groups = await customerService.getGroups(organizationId);

        return res.json({
            success: true,
            data: groups
        });
    } catch (error) {
        console.error("List Groups Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch customer groups"
        });
    }
};

exports.createGroup = async (req, res) => {
    try {
        const organizationId = req.headers["x-organization-id"];
        const groupData = { ...req.body, organization_id: organizationId };

        const group = await customerService.createGroup(groupData);

        return res.json({
            success: true,
            data: group,
            message: "Group created successfully"
        });
    } catch (error) {
        console.error("Create Group Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create customer group"
        });
    }
};

// --- Feedback ---

exports.listFeedback = async (req, res) => {
    try {
        const { store_id, rating, status } = req.query;
        const feedback = await customerService.getFeedback(store_id, { rating, status });

        return res.json({
            success: true,
            data: feedback
        });
    } catch (error) {
        console.error("List Feedback Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch feedback"
        });
    }
};

exports.updateFeedbackStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updated = await customerService.updateFeedbackStatus(id, status);

        return res.json({
            success: true,
            data: updated,
            message: "Feedback status updated"
        });
    } catch (error) {
        console.error("Update Feedback Status Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update feedback status"
        });
    }
};

// --- Engagements ---

exports.listEngagements = async (req, res) => {
    try {
        const organizationId = req.headers["x-organization-id"];
        const { customer_id } = req.query;

        const engagements = await customerService.getEngagements(organizationId, {
            customerId: customer_id
        });

        return res.json({
            success: true,
            data: engagements
        });
    } catch (error) {
        console.error("List Engagements Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch customer engagements"
        });
    }
};

exports.createEngagement = async (req, res) => {
    try {
        const organizationId = req.headers["x-organization-id"];
        const engagementData = { ...req.body, organization_id: organizationId };

        const engagement = await customerService.createEngagement(engagementData);

        return res.json({
            success: true,
            data: engagement,
            message: "Engagement response sent"
        });
    } catch (error) {
        console.error("Create Engagement Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to send engagement response"
        });
    }
};

// --- Insights ---

exports.getInsights = async (req, res) => {
    try {
        const organizationId = req.headers["x-organization-id"];
        const insights = await customerService.getInsights(organizationId);

        return res.json({
            success: true,
            data: insights
        });
    } catch (error) {
        console.error("Customer Insights Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch customer insights"
        });
    }
};
