const paymentService = require("../../services/admin/payment.service");

/**
 * Uber-Style Payment Controller
 */

// --- Payouts & Invoices ---

exports.listPayouts = async (req, res) => {
    try {
        const organizationId = req.headers["x-organization-id"];
        const { store_id, status } = req.query;

        const payouts = await paymentService.getPayouts(organizationId, { storeId: store_id, status });

        return res.json({
            success: true,
            data: payouts
        });
    } catch (error) {
        console.error("List Payouts Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch payouts"
        });
    }
};

exports.getSummary = async (req, res) => {
    try {
        const organizationId = req.headers["x-organization-id"];
        const { store_id } = req.query;

        const summary = await paymentService.getFinancialSummary(organizationId, { storeId: store_id });

        return res.json({
            success: true,
            data: summary
        });
    } catch (error) {
        console.error("Financial Summary Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch financial summary"
        });
    }
};

exports.listInvoices = async (req, res) => {
    try {
        const organizationId = req.headers["x-organization-id"];
        const { store_id, limit } = req.query;

        const invoices = await paymentService.getInvoices(organizationId, { storeId: store_id, limit });

        return res.json({
            success: true,
            data: invoices
        });
    } catch (error) {
        console.error("List Invoices Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch invoices"
        });
    }
};

// --- Bank Accounts ---

exports.listBankAccounts = async (req, res) => {
    try {
        const organizationId = req.headers["x-organization-id"];
        const accounts = await paymentService.getBankAccounts(organizationId);

        return res.json({
            success: true,
            data: accounts
        });
    } catch (error) {
        console.error("List Bank Accounts Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch bank accounts"
        });
    }
};

exports.addBankAccount = async (req, res) => {
    try {
        const organizationId = req.headers["x-organization-id"];
        const bankData = { ...req.body, organization_id: organizationId };

        const account = await paymentService.addBankAccount(bankData);

        return res.json({
            success: true,
            data: account,
            message: "Bank account linked successfully"
        });
    } catch (error) {
        console.error("Add Bank Account Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to link bank account"
        });
    }
};

// --- Tax Identity ---

exports.getTaxIdentity = async (req, res) => {
    try {
        const organizationId = req.headers["x-organization-id"];
        const identity = await paymentService.getTaxIdentity(organizationId);

        return res.json({
            success: true,
            data: identity
        });
    } catch (error) {
        console.error("Get Tax Identity Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch tax identity"
        });
    }
};

exports.updateTaxIdentity = async (req, res) => {
    try {
        const organizationId = req.headers["x-organization-id"];
        const identity = await paymentService.updateTaxIdentity(organizationId, req.body);

        return res.json({
            success: true,
            data: identity,
            message: "Tax identity updated successfully"
        });
    } catch (error) {
        console.error("Update Tax Identity Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update tax identity"
        });
    }
};
