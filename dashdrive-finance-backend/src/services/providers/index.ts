import { MockBankProvider, MockInsuranceProvider, MockKycProvider } from './mock.provider';
import { RealBankProvider } from './real/bank.provider';
import { RealInsuranceProvider } from './real/insurance.provider';
import { BankProvider, InsuranceProviderPlugin, KycProvider } from './interfaces';

const useRealProviders = process.env.FINTECH_PROD_MODE === 'true';

export const bankProvider: BankProvider = useRealProviders 
  ? new RealBankProvider() 
  : new MockBankProvider();

export const insuranceProvider: InsuranceProviderPlugin = useRealProviders 
  ? new RealInsuranceProvider() 
  : new MockInsuranceProvider();

// KYC real integration as a future increment
export const kycProvider: KycProvider = new MockKycProvider();

export * from './interfaces';
