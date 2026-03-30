import { BaseProvider } from '../base.provider';
import { BankProvider } from '../interfaces';

export class RealBankProvider extends BaseProvider implements BankProvider {
  name = 'ProductionBank';

  constructor() {
    super(process.env.BANK_API_URL || 'https://api.testbank.com', process.env.BANK_API_KEY || '');
  }

  async createWallet(userId: string) {
    return this.post<{ externalId: string }>('/wallets', { userId });
  }

  async getBalance(walletId: string) {
    const res = await this.get<{ balance: number }>(`/wallets/${walletId}/balance`);
    return res.balance;
  }

  async initiateTransfer(from: string, to: string, amount: number) {
    return this.post<{ reference: string; status: 'completed' | 'pending' | 'failed' }>('/transfers', {
      from,
      to,
      amount,
    });
  }

  async initiateTopup(walletId: string, amount: number, method: string) {
    return this.post<{ reference: string; status: 'pending' }>('/topup', {
      walletId,
      amount,
      method,
    });
  }
}
