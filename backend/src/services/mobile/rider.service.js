const supabase = require("../../config/supabase");

/**
 * Uber-Style Rider (Customer) Service
 */

exports.searchStores = async (query, { category, location }) => {
    let dbQuery = supabase
        .from("stores")
        .select("*, organizations(name)")
        .eq("is_active", true);

    if (query) {
        dbQuery = dbQuery.ilike("name", `%${query}%`);
    }

    if (category) {
        // Assuming stores have a category or tags column in the future
        // dbQuery = dbQuery.contains("tags", [category]);
    }

    const { data: stores, error } = await dbQuery.limit(20);
    if (error) {
        console.error("❌ Search Error:", error.message);
        throw error;
    }

    console.log(`[Search] Query: "${query}", Found: ${stores?.length || 0}`);
    return stores;
};

exports.getStoreWithMenu = async (storeId) => {
    // 1. Fetch Store
    const { data: store, error: storeErr } = await supabase
        .from("stores")
        .select("*, organizations(name)")
        .eq("id", storeId)
        .single();
    if (storeErr) throw storeErr;

    // 2. Fetch Menu Categories & Items
    const { data: categories, error: menuErr } = await supabase
        .from("menu_categories")
        .select(`
            *,
            menu_items(*)
        `)
        .eq("store_id", storeId)
        .eq("is_active", true);

    if (menuErr) throw menuErr;

    return {
        ...store,
        menu: categories
    };
};

exports.processMobileOrder = async (orderData) => {
    const { userId, storeId, organizationId, items, totalAmount, deliveryAddress } = orderData;

    // 1. Create Base Order
    const { data: order, error: orderErr } = await supabase
        .from("orders")
        .insert([{
            store_id: storeId,
            organization_id: organizationId,
            customer_name: "Mobile User", // Should come from user profile in real auth
            total_amount: totalAmount,
            status: 'new',
            metadata: {
                delivery_address: deliveryAddress,
                source: 'mobile_app'
            }
        }])
        .select()
        .single();

    if (orderErr) throw orderErr;

    // 2. Insert Order Items
    const orderItems = items.map(item => ({
        order_id: order.id,
        menu_item_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity
    }));

    const { error: itemsErr } = await supabase
        .from("order_items")
        .insert(orderItems);

    if (itemsErr) throw itemsErr;

    return order;
};

exports.getRiderActiveOrders = async (userId) => {
    const { data, error } = await supabase
        .from("orders")
        .select("*, stores(name, logo_url)")
        .in("status", ['new', 'accepted', 'preparing', 'ready', 'picked_up'])
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
};
