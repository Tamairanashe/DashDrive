const supabase = require('../../config/supabase');

/**
 * Merchant Store Management Service
 */

/**
 * Organizations (Multi-tenant Brands)
 */
exports.createOrganization = async ({ name, slug, logoUrl }) => {
    const { data, error } = await supabase
        .from('organizations')
        .insert([{ name, slug, logo_url: logoUrl }])
        .select()
        .single();

    if (error) throw error;
    return data;
};

exports.getOrganizationBySlug = async (slug) => {
    const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) throw error;
    return data;
};

/**
 * Regions
 */
exports.createRegion = async ({ organizationId, name }) => {
    const { data, error } = await supabase
        .from('regions')
        .insert([{ organization_id: organizationId, name }])
        .select()
        .single();

    if (error) throw error;
    return data;
};

exports.getRegionsByOrg = async (organizationId) => {
    const { data, error } = await supabase
        .from('regions')
        .select('*')
        .eq('organization_id', organizationId);

    if (error) throw error;
    return data;
};

/**
 * Stores (Physical Locations)
 */
exports.createStore = async ({ organizationId, regionId, name, address, timezone }) => {
    const { data, error } = await supabase
        .from('stores')
        .insert([{
            organization_id: organizationId,
            region_id: regionId,
            name,
            address,
            timezone
        }])
        .select()
        .single();

    if (error) throw error;
    return data;
};

exports.updateStoreStatus = async (storeId, { isActive, acceptanceMode, slaBreachMinutes }) => {
    const updateData = {
        updated_at: new Date()
    };
    if (isActive !== undefined) updateData.is_active = isActive;
    if (acceptanceMode) updateData.acceptance_mode = acceptanceMode;
    if (slaBreachMinutes) updateData.sla_breach_minutes = slaBreachMinutes;

    const { data, error } = await supabase
        .from('stores')
        .update(updateData)
        .eq('id', storeId)
        .select()
        .single();

    if (error) throw error;
    return data;
};

exports.getStoresByOrg = async (organizationId) => {
    const { data, error } = await supabase
        .from('stores')
        .select('*, regions(name)')
        .eq('organization_id', organizationId);

    if (error) throw error;
    return data;
};

exports.getStoreDetails = async (storeId) => {
    const { data, error } = await supabase
        .from('stores')
        .select('*, regions(*), organizations(*)')
        .eq('id', storeId)
        .single();

    if (error) throw error;
    return data;
};
