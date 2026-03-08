const axios = require('axios');

const API_URL = 'http://localhost:8000/api/v1/auth';

async function testAuthFeatures() {
    console.log('--- Testing New Auth Features ---');

    try {
        // 1. Test Password Reset (Non-super user)
        // Note: For this to work, the email must exist in Supabase and merchants table.
        // We'll use the one we created earlier: dash_test_01@dashdrive.com
        console.log('\nTesting Forgot Password (Expect success)...');
        const forgotRes = await axios.post(`${API_URL}/forgot-password`, {
            email: 'dash_test_01@dashdrive.com'
        });
        console.log('Response:', forgotRes.data);

        // 2. Test Email Recovery (Expect success if phone matches)
        // First we need to know the phone number for dash_test_01.
        // During registration earlier it was nulled or default.
        // Let's try to register a new one with a known phone first to be sure.
        const uniqueEmail = `recover_test_${Date.now()}@dashdrive.com`;
        const testPhone = `+26377${Math.floor(Math.random() * 1000000)}`;
        
        console.log(`\nRegistering test user with phone: ${testPhone}`);
        await axios.post(`${API_URL}/register`, {
            email: uniqueEmail,
            password: 'Password123!',
            storeName: 'Recovery Test Store',
            phone: testPhone
        });

        console.log('\nTesting Email Recovery (Expect success and masked email)...');
        const recoverRes = await axios.post(`${API_URL}/recover-email`, {
            phone: testPhone
        });
        console.log('Response:', recoverRes.data);
        if (recoverRes.data.masked_email) {
            console.log('✅ Masked email received:', recoverRes.data.masked_email);
        }

    } catch (err) {
        console.error('❌ Test failed:', err.response?.data || err.message);
    }
}

testAuthFeatures();
