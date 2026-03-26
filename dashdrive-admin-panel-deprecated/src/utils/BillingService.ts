export type TransactionType = 'commission' | 'payout' | 'refund' | 'premium_collection';

export interface BillingTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency: string;
  referenceId: string; // LeadId, ApplicationId, or PolicyId
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
}

export class BillingService {
  private static transactions: BillingTransaction[] = [];

  static recordTransaction(transaction: Omit<BillingTransaction, 'id' | 'timestamp'>): BillingTransaction {
    const newTx: BillingTransaction = {
      ...transaction,
      id: `TX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      timestamp: new Date().toISOString(),
    };
    this.transactions.push(newTx);
    return newTx;
  }

  static getTransactionsByReference(refId: string): BillingTransaction[] {
    return this.transactions.filter(tx => tx.referenceId === refId);
  }

  static getTotalCommissions(): number {
    return this.transactions
      .filter(tx => tx.type === 'commission' && tx.status === 'completed')
      .reduce((sum, tx) => sum + tx.amount, 0);
  }

  static listAllTransactions(): BillingTransaction[] {
    return this.transactions;
  }
}
