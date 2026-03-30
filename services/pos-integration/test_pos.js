const axios = require('axios');

const POS_URL = 'http://localhost:3003';
const MERCHANT_ID = 'test-merchant-456';

async function testConnection() {
    console.log(`\n--- Testing POS Connection (Mock) ---`);
    try {
        const response = await axios.post(`${POS_URL}/auth/mock/connect`, {
            merchantId: MERCHANT_ID
        });
        console.log('✅ Connection Success!', response.data);
        return true;
    } catch (error) {
        console.error('❌ Connection Failed:', error.response?.data || error.message);
        return false;
    }
}

async function testWebhookSync() {
    console.log(`\n--- Testing Webhook Ingress & Sync Flow ---`);
    try {
        const response = await axios.post(`${POS_URL}/webhooks/mock`, {
            type: 'MENU_UPDATE',
            data: { trigger: 'manual_test' }
        }, {
            headers: { 'x-signature': 'mock_signature' }
        });
        console.log('✅ Webhook Accepted!', response.data);
        console.log('Note: Check console logs of the POS service to verify background BullMQ job processing.');
        return true;
    } catch (error) {
        console.error('❌ Webhook Failed:', error.response?.data || error.message);
        return false;
    }
}

async function runTests() {
    console.log('Starting DashDrive POS Integration Tests...');
    
    // Step 1: Connect
    const connected = await testConnection();
    if (!connected) return;

    // Step 2: Trigger Webhook
    await testWebhookSync();
}

runTests();
