const supabase = require("../../config/supabase");

/**
 * Uber-Style Marketing & Offers Service
 */

// --- Campaigns ---

exports.getCampaigns = async (organizationId, { storeId, status }) => {
    let query = supabase
        .from("marketing_campaigns")
        .select("*, stores(name)")
        .eq("organization_id", organizationId);

    if (storeId) {
        query = query.eq("store_id", storeId);
    }
    if (status) {
        query = query.eq("status", status);
    }

    const { data, error } = await query.order("created_at", { ascending: false });
    if (error) throw error;
    return data;
};

exports.createCampaign = async (campaignData) => {
    const { data, error } = await supabase
        .from("marketing_campaigns")
        .insert([campaignData])
        .select()
        .single();

    if (error) throw error;
    return data;
};

// --- Ads ---

exports.getAds = async (organizationId, { campaignId }) => {
    let query = supabase
        .from("marketing_ads")
        .select("*, marketing_campaigns(name)")
        .eq("organization_id", organizationId);

    if (campaignId) {
        query = query.eq("campaign_id", campaignId);
    }

    const { data, error } = await query.order("created_at", { ascending: false });
    if (error) throw error;
    return data;
};

// --- Offers ---

exports.getOffers = async (organizationId, { storeId, isActive }) => {
    let query = supabase
        .from("marketing_offers")
        .select("*, stores(name)")
        .eq("organization_id", organizationId);

    if (storeId) {
        query = query.eq("store_id", storeId);
    }

    if (isActive !== undefined) {
        query = query.eq("is_active", isActive);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) throw error;
    return data;
};

exports.createOffer = async (offerData) => {
    const { data, error } = await supabase
        .from("marketing_offers")
        .insert([offerData])
        .select()
        .single();

    if (error) throw error;
    return data;
};

exports.updateOffer = async (offerId, updateData) => {
    const { data, error } = await supabase
        .from("marketing_offers")
        .update({
            ...updateData,
            updated_at: new Date().toISOString()
        })
        .eq("id", offerId)
        .select()
        .single();

    if (error) throw error;
    return data;
};

exports.deleteOffer = async (offerId) => {
    const { error } = await supabase
        .from("marketing_offers")
        .delete()
        .eq("id", offerId);

    if (error) throw error;
    return { success: true };
};
