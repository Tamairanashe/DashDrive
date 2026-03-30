const axios = require('axios');

const BASE_URL = 'http://localhost:3002'; // Removed /api prefix based on main.ts

async function testFintechFlow() {
  try {
    console.log('--- Testing Fintech Lead Creation ---');
    const leadResponse = await axios.post(`${BASE_URL}/fintech/leads`, {
      userId: 'driver-123',
      userType: 'Driver',
      productType: 'LOAN',
      provider: 'MoneyLion',
      initialAmount: 5000,
      apr: 12.5,
    });
    const lead = leadResponse.data;
    console.log('Lead Created:', lead);

    console.log('\n--- Testing Offer Ranking ---');
    const rankingResponse = await axios.post(`${BASE_URL}/fintech/matching/rank`, {
      user: {
        id: 'driver-123',
        name: 'John Doe',
        type: 'Driver',
        earnings: 1500,
        rating: 4.8,
        tripVolume: 500,
        accountAgeMonths: 14,
        location: 'Harare',
        creditScore: 720,
      },
      products: [
        {
          id: 'P1',
          name: 'Premium Loan',
          provider: 'Bank A',
          type: 'LOAN',
          thresholds: { minEarnings: 1000 },
          partnerPriority: 8,
          revenuePotential: 9,
          approvalProbability: 0.8,
          estimatedCommission: 100,
        },
        {
          id: 'P2',
          name: 'Starter Loan',
          provider: 'Bank B',
          type: 'LOAN',
          thresholds: { minEarnings: 500 },
          partnerPriority: 5,
          revenuePotential: 5,
          approvalProbability: 0.95,
          estimatedCommission: 20,
        }
      ]
    });
    console.log('Ranked Offers:', rankingResponse.data.map(r => ({ name: r.product.name, score: r.score })));

    console.log('\n--- Testing Webhook Postback (Conversion) ---');
    const webhookResponse = await axios.post(`${BASE_URL}/fintech/webhooks/postback`, {
      event: 'converted',
      leadUuid: lead.leadUuid,
      transactionId: `tx-${Date.now()}`,
      payoutAmount: 150,
    });
    console.log('Webhook Response:', webhookResponse.data);

    console.log('\n--- Verifying Lead Status Update ---');
    const updatedLeadResponse = await axios.get(`${BASE_URL}/fintech/leads/${lead.leadUuid}`);
    console.log('Updated Lead Status:', updatedLeadResponse.data.status);

  } catch (error) {
    console.error('Test Failed:', error.response ? error.response.data : error.message);
  }
}

testFintechFlow();
