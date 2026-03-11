import { BankProvider, InsuranceProviderPlugin, KycProvider } from './interfaces';

export class MockBankProvider implements BankProvider {
  name = 'MockBank';
  async createWallet(userId: string) {
    return { externalId: `mock_acc_${Math.random().toString(36).substr(2, 9)}` };
  }
  async getBalance(walletId: string) {
    return 1000.00;
  }
  async initiateTransfer(from: string, to: string, amount: number) {
    return { reference: `tx_${Date.now()}`, status: 'completed' as const };
  }
  async initiateTopup(walletId: string, amount: number, method: string) {
    return { reference: `topup_${Date.now()}`, status: 'pending' as const };
  }
}

export class MockInsuranceProvider implements InsuranceProviderPlugin {
  name = 'MockInsure';
  async quotePolicy(userId: string, productType: string, amount: number) {
    return { quoteId: `quote_${Date.now()}`, premium: amount * 0.05 };
  }
  async issuePolicy(quoteId: string) {
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    return { policyNumber: `POL-${Math.random().toString(36).toUpperCase().substr(2, 6)}`, expiresAt };
  }
  async fileClaim(policyNumber: string, amount: number) {
    return { claimId: `claim_${Date.now()}`, status: 'under_review' };
  }
}

export class MockKycProvider implements KycProvider {
  name = 'MockVerify';
  async submitDocument(userId: string, docType: string, docUrl: string) {
    return { submissionId: `kyc_${Date.now()}`, status: 'pending' };
  }
  async getVerificationStatus(submissionId: string) {
    return { status: 'verified' as const };
  }
}
