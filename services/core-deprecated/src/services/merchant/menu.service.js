const supabase = require('../../config/supabase');

/**
 * Merchant Menu CMS Service
 */

/**
 * Menu Categories
 */
exports.createCategory = async ({ storeId, organizationId, name, rank }) => {
    const { data, error } = await supabase
        .from('menu_categories')
        .insert([{
            store_id: storeId,
            organization_id: organizationId,
            name,
            rank: rank || 0
        }])
        .select()
        .single();

    if (error) throw error;
    return data;
};

exports.getCategoriesByStore = async (storeId) => {
    const { data, error } = await supabase
        .from('menu_categories')
        .select('*')
        .eq('store_id', storeId)
        .order('rank', { ascending: true });

    if (error) throw error;
    return data;
};

exports.updateCategory = async (categoryId, { name, rank, isActive }) => {
    const updateData = {};
    if (name) updateData.name = name;
    if (rank !== undefined) updateData.rank = rank;
    if (isActive !== undefined) updateData.is_active = isActive;

    const { data, error } = await supabase
        .from('menu_categories')
        .update(updateData)
        .eq('id', categoryId)
        .select()
        .single();

    if (error) throw error;
    return data;
};

/**
 * Menu Items
 */
exports.createMenuItem = async ({ categoryId, name, description, price, imageUrl, tags }) => {
    const { data, error } = await supabase
        .from('menu_items')
        .insert([{
            category_id: categoryId,
            name,
            description,
            price,
            image_url: imageUrl,
            tags: tags || []
        }])
        .select()
        .single();

    if (error) throw error;
    return data;
};

exports.getItemsByCategory = async (categoryId) => {
    const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('category_id', categoryId);

    if (error) throw error;
    return data;
};

const logisticsInventory = require('../common/logisticsInventoryService');

// ... (existing exports)

exports.updateMenuItem = async (itemId, updateData) => {
    const { data, error } = await supabase
        .from('menu_items')
        .update({ ...updateData, updated_at: new Date() })
        .eq('id', itemId)
        .select()
        .single();

    if (error) throw error;

    // Trigger Sync if availability changed
    if (updateData.is_available !== undefined) {
        logisticsInventory.syncInventory(itemId, updateData.is_available);
    }

    return data;
};

exports.getStoreMenu = async (storeId) => {
    // Advanced join to get categories with their items
    const { data, error } = await supabase
        .from('menu_categories')
        .select(`
            *,
            menu_items (*)
        `)
        .eq('store_id', storeId)
        .eq('is_active', true)
        .order('rank', { ascending: true });

    if (error) throw error;
    return data;
};
