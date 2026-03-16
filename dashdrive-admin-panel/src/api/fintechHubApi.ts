import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Adding Idempotency Key interceptor (simplified)
client.interceptors.request.use((config) => {
  if (config.method === 'post' || config.method === 'put') {
    config.headers['Idempotency-Key'] = crypto.randomUUID();
  }
  return config;
});

export const fintechHubApi = {
  // 1. Payments API
  payments: {
    create: (data: { order_id: string; amount: number; currency: string; payment_method: string; customer_id: string }) => 
      client.post('/fintech/payments', data),
    getStatus: (transactionId: string) => 
      client.get(`/fintech/payments/${transactionId}`),
    refund: (data: { transaction_id: string; refund_amount: number; reason: string }) => 
      client.post('/fintech/payments/refund', data),
  },

  // 2. Wallet API
  wallets: {
    create: (data: { owner_id: string; wallet_type: 'customer' | 'driver' | 'merchant' }) => 
      client.post('/fintech/wallets', data),
    getBalance: (walletId: string) => 
      client.get(`/fintech/wallets/${walletId}`),
    credit: (data: { wallet_id: string; amount: number; reason: string }) => 
      client.post('/fintech/wallets/credit', data),
    debit: (data: { wallet_id: string; amount: number; reason: string }) => 
      client.post('/fintech/wallets/debit', data),
    transfer: (data: { from_wallet: string; to_wallet: string; amount: number }) => 
      client.post('/fintech/wallets/transfer', data),
    transferP2P: (data: { from_wallet_id: string; recipient_identifier: string; amount: number; reason?: string; currency?: string }) => 
      client.post('/fintech/wallets/transfer-p2p', data),
    lookupRecipient: (identifier: string, currency: string = 'USD') => 
      client.get(`/fintech/wallets/lookup/${identifier}`, { params: { currency } }),
  },

  // 3. Bank Payout API
  payouts: {
    create: (data: { partner_id: string; amount: number; bank_account: string; bank_code: string }) => 
      client.post('/fintech/payouts', data),
    getStatus: (payoutId: string) => 
      client.get(`/fintech/payouts/${payoutId}`),
  },

  // 4. Bill Payment API
  bills: {
    verify: (data: { provider: string; account_number: string }) => 
      client.post('/fintech/bills/verify', data),
    pay: (data: { provider: string; account_number: string; amount: number }) => 
      client.post('/fintech/bills/pay', data),
    getBillers: () => client.get('/fintech/billers'),
    seedBillers: () => client.post('/fintech/billers/seed'),
  },

  // 5. Airtime & Data API
  telecom: {
    topupAirtime: (data: { phone_number: string; network: string; amount: number }) => 
      client.post('/fintech/airtime/topup', data),
    purchaseData: (data: { phone_number: string; bundle_id: string }) => 
      client.post('/fintech/data/purchase', data),
  },

  // 6. Lending / BNPL API
  lending: {
    apply: (data: { user_id: string; amount: number; purpose: string }) => 
      client.post('/fintech/loans/apply', data),
    getStatus: (loanId: string) => 
      client.get(`/fintech/loans/${loanId}`),
  },

  // 7. Insurance API
  insurance: {
    createPolicy: (data: { policy_type: string; ride_id: string; coverage_amount: number }) => 
      client.post('/fintech/insurance/policies', data),
    fileClaim: (data: { policy_id: string; incident_description: string }) => 
      client.post('/fintech/insurance/claims', data),
  },

  // 8. Compliance & KYC API
  compliance: {
    verifyKyc: (data: { user_id: string; id_number: string }) => 
      client.post('/fintech/kyc/verify', data),
    checkAml: (data: { user_id: string }) => 
      client.post('/fintech/compliance/aml', data),
    getAudit: () => client.get('/fintech/compliance/audit', { responseType: 'blob' }),
    updateThresholds: (data: any) => client.post('/fintech/compliance/thresholds', data),
    getThresholds: () => client.get('/fintech/compliance/thresholds'),
  },

  // 9. Provider Management API
  providers: {
    list: () => client.get('/fintech/admin/providers'),
    get: (key: string) => client.get(`/fintech/admin/providers/${key}`),
    upsert: (key: string, data: any) => client.post(`/fintech/admin/providers/${key}`, data),
    delete: (key: string) => client.post(`/fintech/admin/providers/${key}/delete`),
    getStatus: (providerId: string) => 
      client.get(`/fintech/providers/${providerId}/status`),
    getPerformance: () => client.get('/fintech/admin/providers/performance'),
  },

  // 11. Admin Monitoring 
  admin: {
    getTransactions: () => client.get('/fintech/admin/transactions'),
    getWalletLedger: () => client.get('/fintech/admin/wallet-ledger'),
  },

  // 12. Driver Bundles API
  bundles: {
    purchase: (data: { riderId: string; bundleId: string; amount: number; currency: string; rides: number; expiryDays: number }) => 
      client.post('/fintech/bundles/purchase', data),
    getRiderBundles: (riderId: string) => 
      client.get(`/fintech/bundles/rider/${riderId}`),
  }
};
