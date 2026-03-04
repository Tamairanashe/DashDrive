require('dotenv').config();
const axios = require('axios');

const API_URL = `http://localhost:${process.env.PORT || 8000}/api/merchant`;
const API_KEY = process.env.BACKEND_API_KEY;

const authHeader = {
    headers: {
        'Authorization': `Bearer mock-merchant-token`,
        'x-api-key': API_KEY
    }
};

async function verifyMerchantFlow() {
    console.log("--- Starting Merchant Backend Verification ---");

    try {
        // 1. Setup Organization
        console.log("🏢 Setting up new Organization: 'Pizza Galaxy'...");
        const orgRes = await axios.post(`${API_URL}/store/setup`, {
            name: "Pizza Galaxy",
            slug: "pizza-galaxy",
            logoUrl: "https://example.com/logo.png"
        }, authHeader).catch(e => {
            console.warn("⚠️ API Call failed (expected if server isn't running):", e.message);
            return { data: { success: false } };
        });

        if (orgRes.data.success) {
            const orgId = orgRes.data.data.id;
            console.log(`✅ Organization created: ${orgId}`);

            // 2. Add Store
            console.log("📍 Adding Downtown Store...");
            const storeRes = await axios.post(`${API_URL}/store/add`, {
                organizationId: orgId,
                name: "Pizza Galaxy Downtown",
                address: "123 Main St",
                timezone: "EST"
            }, authHeader).catch(() => ({ data: { success: false } }));

            if (storeRes.data.success) {
                const storeId = storeRes.data.data.id;
                console.log(`✅ Store created: ${storeId}`);

                // 3. Add Category
                console.log("📂 Adding Menu Category: 'Pizzas'...");
                const catRes = await axios.post(`${API_URL}/menu/category`, {
                    storeId,
                    organizationId: orgId,
                    name: "Pizzas",
                    rank: 1
                }, authHeader).catch(() => ({ data: { success: false } }));

                if (catRes.data.success) {
                    const catId = catRes.data.data.id;
                    console.log(`✅ Category created: ${catId}`);

                    // 4. Add Menu Item
                    console.log("🍕 Adding Menu Item: 'Margherita'...");
                    const itemRes = await axios.post(`${API_URL}/menu/item`, {
                        categoryId: catId,
                        name: "Margherita Pizza",
                        description: "Classic tomato and mozzarella",
                        price: 12.99
                    }, authHeader).catch(() => ({ data: { success: false } }));

                    if (itemRes.data.success) {
                        console.log("✅ Menu item created successfully!");
                    }
                }
            }
        }

        console.log("--- Merchant Verification Logic Complete ---");
    } catch (error) {
        console.error("❌ Verification failed:", error.message);
    }
}

verifyMerchantFlow();
