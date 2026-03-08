const axios = require('axios');

const API_URL = 'http://localhost:3002/auth/login';

async function testAdminLogin() {
  console.log('--- Testing Admin Login (Supabase Backed) ---');
  
  try {
    const response = await axios.post(API_URL, {
      email: 'admin@dashdrive.com',
      password: 'AdminPassword2026!'
    });
    
    console.log('✅ Status Code:', response.status);
    console.log('✅ Response:', JSON.stringify(response.data, null, 2));
    
    if (response.data.access_token && response.data.user.role === 'SUPER_ADMIN') {
      console.log('✅ Admin authenticated successfully with correct role.');
    } else {
      console.error('❌ Admin authentication failed or role incorrect.');
    }
  } catch (err) {
    console.error('❌ Login failed:', err.response?.data?.message || err.message);
  }
}

testAdminLogin();
