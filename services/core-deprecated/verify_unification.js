const axios = require('axios');

/**
 * Verification Script: Unified Backend Flow
 * Tests: Order Acceptance -> Status History -> Automated Dispatch -> Trip Creation
 */

const API_BASE_URL = 'http://localhost:8000';
const API_KEY = 'dashdrive_secret_key_2026'; // Ensure this matches your .env

const testUnification = async () => {
    console.log("🚀 Starting Unified Backend Verification...");

    try {
        // 1. Create a dummy order for testing
        console.log("\n1. Injecting New Order...");
        const newOrderResponse = await axios.post(`${API_BASE_URL}/webhooks/new-order`, {
            customer: "Unification Tester",
            amount: 45.99,
            store_id: "476e91d7-3b2a-4e83-680a-7f61ff95bf3c",
            organization_id: "cfd01e92-8b1d-4afd-8d27-0a18aa8564ed",
            items: [{ name: "Unified Meal", price: 45.99, qty: 1 }]
        }, {
            headers: { 'x-api-key': API_KEY }
        });

        const orderId = newOrderResponse.data.orderId;
        console.log(`✅ Order Created: ${orderId}`);

        // 2. Merchant Accepts Order (preparing)
        console.log("\n2. Merchant Accepting Order...");
        await axios.patch(`${API_BASE_URL}/api/orders/${orderId}/status`, 
            { status: 'preparing' },
            { headers: { 'x-api-key': API_KEY } }
        );
        console.log("✅ Order Status -> preparing");

        // 3. Merchant Marks Ready (triggers dispatch)
        console.log("\n3. Merchant Marking Ready (Triggering Dispatch)...");
        await axios.patch(`${API_BASE_URL}/api/orders/${orderId}/status`, 
            { status: 'ready' },
            { headers: { 'x-api-key': API_KEY } }
        );
        console.log("✅ Order Status -> ready");

        // 4. Verify History and Trip (via Supabase logic or API)
        console.log("\n4. Verification Summary (Wait for background dispatch)...");
        setTimeout(() => {
            console.log("👉 Check your Supabase 'order_status_history' and 'trips' tables.");
            console.log("👉 You should see entries for 'preparing', 'ready', and potentially 'assigned' if a pilot was online.");
        }, 2000);

    } catch (error) {
        console.error("❌ Verification Failed:", error.response?.data || error.message);
    }
};

testUnification();
