const axios = require('axios');

async function testAuth() {
  const email = 'admin@dashdrive.com';
  const password = 'AdminPassword2026!';
  const baseUrl = 'http://127.0.0.1:3002'; // Use 127.0.0.1 for better compatibility

  try {
    console.log(`--- Testing Login at ${baseUrl} ---`);
    const loginRes = await axios.post(`${baseUrl}/auth/login`, { email, password }).catch(e => {
        if (e.code === 'ECONNREFUSED') throw new Error(`Connection refused at ${baseUrl}. Is the server running?`);
        throw e;
    });
    const token = loginRes.data.access_token;
    console.log('Login Success! Token received.');

    const headers = { Authorization: `Bearer ${token}` };

    console.log('\n--- Testing User Directory ---');
    const usersRes = await axios.get(`${baseUrl}/users`, { headers });
    console.log(`Found ${usersRes.data.data.length} admin users.`);
    console.log('Users:', usersRes.data.data.map(u => ({ name: u.name, role: u.role })));

    console.log('\n--- Testing Merchant List (Approvals) ---');
    const storesRes = await axios.get(`${baseUrl}/admin/stores/list?status=PENDING`, { headers });
    console.log(`Found ${storesRes.data.length} stores returned.`);

    console.log('\n--- Testing Platform Config ---');
    const configRes = await axios.get(`${baseUrl}/platform-config`, { headers });
    console.log(`Found ${configRes.data.data.length} global configurations.`);

    console.log('\n--- ALL BACKEND TESTS PASSED ---');
  } catch (error) {
    console.error('Test Failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
    process.exit(1);
  }
}

testAuth();
