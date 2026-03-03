const marketingService = require("../../services/admin/marketing.service");

/**
 * Uber-Style Marketing & Offers Controller
 */

// --- Campaigns ---

exports.listCampaigns = async (req, res) => {
    try {
        const organizationId = req.headers["x-organization-id"];
        const { store_id, status } = req.query;

        const campaigns = await marketingService.getCampaigns(organizationId, {
            storeId: store_id,
            status
        });

        return res.json({
            success: true,
            data: campaigns
        });
    } catch (error) {
        console.error("List Campaigns Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch campaigns"
        });
    }
};

exports.createCampaign = async (req, res) => {
    try {
        const organizationId = req.headers["x-organization-id"];
        const campaignData = { ...req.body, organization_id: organizationId };

        const campaign = await marketingService.createCampaign(campaignData);

        return res.json({
            success: true,
            data: campaign,
            message: "Campaign created successfully"
        });
    } catch (error) {
        console.error("Create Campaign Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create campaign"
        });
    }
};

// --- Ads ---

exports.listAds = async (req, res) => {
    try {
        const organizationId = req.headers["x-organization-id"];
        const { campaign_id } = req.query;

        const ads = await marketingService.getAds(organizationId, {
            campaignId: campaign_id
        });

        return res.json({
            success: true,
            data: ads
        });
    } catch (error) {
        console.error("List Ads Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch ads"
        });
    }
};

// --- Offers ---

exports.listOffers = async (req, res) => {
    try {
        const organizationId = req.headers["x-organization-id"];
        const { store_id, is_active } = req.query;

        const offers = await marketingService.getOffers(organizationId, {
            storeId: store_id,
            isActive: is_active === 'true' ? true : (is_active === 'false' ? false : undefined)
        });

        return res.json({
            success: true,
            data: offers
        });
    } catch (error) {
        console.error("List Offers Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch offers"
        });
    }
};

exports.createOffer = async (req, res) => {
    try {
        const organizationId = req.headers["x-organization-id"];
        const offerData = { ...req.body, organization_id: organizationId };

        const offer = await marketingService.createOffer(offerData);

        return res.json({
            success: true,
            data: offer,
            message: "Offer created successfully"
        });
    } catch (error) {
        console.error("Create Offer Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create offer"
        });
    }
};

exports.updateOffer = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await marketingService.updateOffer(id, req.body);

        return res.json({
            success: true,
            data: updated,
            message: "Offer updated successfully"
        });
    } catch (error) {
        console.error("Update Offer Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update offer"
        });
    }
};

exports.deleteOffer = async (req, res) => {
    try {
        const { id } = req.params;
        await marketingService.deleteOffer(id);

        return res.json({
            success: true,
            message: "Offer deleted successfully"
        });
    } catch (error) {
        console.error("Delete Offer Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete offer"
        });
    }
};
