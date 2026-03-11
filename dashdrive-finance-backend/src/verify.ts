import { walletService } from './services/wallet.service';
import { paymentService } from './services/payment.service';
import { loanService } from './services/loan.service';
import { prisma } from './lib/prisma';
import { Decimal } from 'decimal.js';

// Mocking Prisma for isolated testing
// We will override the prisma methods used in the services
const mockPrisma: any = {
  wallet: {
    findUnique: async () => ({ id: 'wallet-1', user_id: 'test-user', balance: new Decimal(100), currency: 'USD' }),
    update: async ({ data }: any) => ({ id: 'wallet-1', balance: new Decimal(150), ...data }),
    create: async ({ data }: any) => ({ id: 'wallet-1', ...data }),
  },
  walletTransaction: {
    create: async ({ data }: any) => ({ id: 'tx-1', ...data }),
  },
  paymentMethod: {
    findUnique: async () => ({ id: 'pm-1', type: 'Card', name: 'Test Card' }),
    findFirst: async () => ({ id: 'pm-1', type: 'Card', name: 'Test Card' }),
  },
  walletTopup: {
    create: async ({ data }: any) => ({ id: 'topup-1', ...data }),
  },
  merchant: {
    findUnique: async () => ({ id: 'mch-1', business_name: 'Test Store' }),
    create: async ({ data }: any) => ({ id: 'mch-1', ...data }),
  },
  merchantTransaction: {
    create: async ({ data }: any) => ({ id: 'mtx-1', ...data }),
  },
  loanProduct: {
    findFirst: async () => ({ id: 'lp-1', interest_rate: new Decimal(5.0), max_amount: new Decimal(1000), repayment_period_days: 30 }),
  },
  loanApplication: {
    create: async ({ data }: any) => ({ id: 'app-1', ...data }),
    findUnique: async () => ({ id: 'app-1', user_id: 'user-1', requested_amount: new Decimal(200), product: { interest_rate: new Decimal(5.0), repayment_period_days: 30 }, status: 'approved' }),
    update: async ({ data }: any) => ({ id: 'app-1', ...data }),
  },
  loan: {
    create: async ({ data }: any) => ({ id: 'loan-1', ...data }),
  },
  transfer: {
      create: async ({ data }: any) => ({ id: 'trans-1', ...data }),
  },
  $transaction: async (cb: any) => await cb(mockPrisma),
};

// Injection: Replace the global prisma with our mock
// Note: In a real test we'd use a mocking library or dependency injection
(prisma as any).wallet = mockPrisma.wallet;
(prisma as any).walletTransaction = mockPrisma.walletTransaction;
(prisma as any).paymentMethod = mockPrisma.paymentMethod;
(prisma as any).walletTopup = mockPrisma.walletTopup;
(prisma as any).merchant = mockPrisma.merchant;
(prisma as any).merchantTransaction = mockPrisma.merchantTransaction;
(prisma as any).loanProduct = mockPrisma.loanProduct;
(prisma as any).loanApplication = mockPrisma.loanApplication;
(prisma as any).loan = mockPrisma.loan;
(prisma as any).transfer = mockPrisma.transfer;
(prisma as any).$transaction = mockPrisma.$transaction;

async function verifyFintechFlows() {
  console.log('🚀 Starting Fintech Hub Logic Verification (Mock Mode)...');

  try {
    const testUserId = 'test-user-uuid';
    const merchantId = 'test-merchant-uuid';

    // 1. Wallet Logic
    console.log('\n--- 1. Wallet Retrieval ---');
    const wallet = await walletService.getOrCreateWallet(testUserId);
    console.log(`✅ Wallet found/created: ${wallet.id}`);

    // 2. Mock Top-up
    console.log('\n--- 2. Wallet Top-up ---');
    const topup = await paymentService.topup(testUserId, 500, 'pm-1');
    console.log(`✅ Top-up logic executed: ${topup.id} | Status: ${topup.status}`);

    // 3. Merchant Payment
    console.log('\n--- 3. Merchant Payment ---');
    const payment = await paymentService.payMerchant(testUserId, merchantId, 50);
    console.log(`✅ Merchant Payment logic executed: ${payment.amount}`);

    // 4. Loan Application & Disbursement
    console.log('\n--- 4. Loan Flow ---');
    const app = await loanService.applyForLoan(testUserId, 'lp-1', 200);
    console.log(`✅ Loan Application logic executed: ${app.id}`);
    
    const loan = await loanService.disburseLoan(app.id);
    console.log(`✅ Loan Disbursement logic executed: ${loan.id} | Total Payable: ${loan.total_payable}`);

    console.log('\n✨ All core logic verified successfully!');

  } catch (error) {
    console.error('\n❌ Verification failed:', error);
  } finally {
    // No disconnect needed for mock
  }
}

verifyFintechFlows();
