const storeService = require('../../services/merchant/store.service');

/**
 * Merchant Store Controller
 */

exports.setupOrganization = async (req, res) => {
    try {
        const { name, slug, logoUrl } = req.body;
        if (!name || !slug) return res.status(400).json({ success: false, message: "Missing required fields" });

        const org = await storeService.createOrganization({ name, slug, logoUrl });
        return res.json({ success: true, data: org });
    } catch (error) {
        console.error("Setup Org Error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.onboardStore = async (req, res) => {
    try {
        const onboardingData = req.body;
        // In a real app, we'd validate the data here
        const result = await storeService.onboardStore(onboardingData);
        return res.json({ success: true, data: result, message: "Onboarding submitted successfully" });
    } catch (error) {
        console.error("Onboard Store Error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.addStore = async (req, res) => {
    try {
        const { organizationId, regionId, name, address, timezone } = req.body;
        if (!organizationId || !name) return res.status(400).json({ success: false, message: "Missing required fields" });

        const store = await storeService.createStore({ organizationId, regionId, name, address, timezone });
        return res.json({ success: true, data: store });
    } catch (error) {
        console.error("Add Store Error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.getOrgStores = async (req, res) => {
    try {
        const { organization_id } = req.params;
        const stores = await storeService.getStoresByOrg(organization_id);
        return res.json({ success: true, data: stores });
    } catch (error) {
        console.error("Get Stores Error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateStoreSettings = async (req, res) => {
    try {
        const { store_id } = req.params;
        const { isActive, acceptanceMode, slaBreachMinutes } = req.body;

        const updated = await storeService.updateStoreStatus(store_id, { isActive, acceptanceMode, slaBreachMinutes });
        return res.json({ success: true, data: updated });
    } catch (error) {
        console.error("Update Store Error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};
