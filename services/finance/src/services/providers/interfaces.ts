export interface BankProvider {
  name: string;
  createWallet(userId: string): Promise<{ externalId: string }>;
  getBalance(walletId: string): Promise<number>;
  initiateTransfer(from: string, to: string, amount: number): Promise<{ reference: string; status: 'completed' | 'pending' | 'failed' }>;
  initiateTopup(walletId: string, amount: number, method: string): Promise<{ reference: string; status: 'pending' }>;
}

export interface InsuranceProviderPlugin {
  name: string;
  quotePolicy(userId: string, productType: string, amount: number): Promise<{ quoteId: string; premium: number }>;
  issuePolicy(quoteId: string): Promise<{ policyNumber: string; expiresAt: Date }>;
  fileClaim(policyNumber: string, amount: number): Promise<{ claimId: string; status: string }>;
}

export interface KycProvider {
  name: string;
  submitDocument(userId: string, docType: string, docUrl: string): Promise<{ submissionId: string; status: string }>;
  getVerificationStatus(submissionId: string): Promise<{ status: 'verified' | 'rejected' | 'pending' }>;
}
