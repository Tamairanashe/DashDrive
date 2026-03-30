const axios = require('axios');

const BACKEND_URL = 'http://localhost:3002';
const ADMIN_EMAIL = 'admin@dashdrive.com';
const ADMIN_PASSWORD = 'AdminPassword2026!'; 

async function runTests() {
  try {
    console.log('--- Auth Test ---');
    const loginRes = await axios.post(`${BACKEND_URL}/auth/login`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });
    const token = loginRes.data.access_token;
    console.log('Login successful');

    const headers = { Authorization: `Bearer ${token}` };

    console.log('\n--- Dashboard Stats ---');
    const statsRes = await axios.get(`${BACKEND_URL}/admin/dashboard/stats`, { headers });
    console.log(statsRes.data);

    console.log('\n--- Recent Alerts ---');
    const alertsRes = await axios.get(`${BACKEND_URL}/admin/dashboard/alerts`, { headers });
    console.log(alertsRes.data);

    console.log('\n--- Operations Live Orders ---');
    const opsRes = await axios.get(`${BACKEND_URL}/admin/operations/live-orders`, { headers });
    console.log(`Found ${opsRes.data.length} live orders`);

    console.log('\n--- Riders List ---');
    const ridersRes = await axios.get(`${BACKEND_URL}/admin/riders`, { headers });
    console.log(`Found ${ridersRes.data.length} riders`);

    console.log('\n--- Full Alerts Audit ---');
    const fullAlertsRes = await axios.get(`${BACKEND_URL}/admin/alerts`, { headers });
    console.log(`Found ${fullAlertsRes.data.length} alerts`);

    console.log('\n--- TEST SUCCESSFUL ---');
  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
  }
}

runTests();
