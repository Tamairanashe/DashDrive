import { Injectable, Logger } from '@nestjs/common';
import { WalletService } from '../fintech/wallet.service';

@Injectable()
export class PaymentGatewayService {
  private readonly logger = new Logger(PaymentGatewayService.name);
  private readonly COMMISSION_RATE = 0.15; // 15% platform commission

  constructor(private walletService: WalletService) {}

  /**
   * Automates the settlement of a completed trip.
   * Debits Customer -> Credits Driver (minus commission).
   */
  async chargeTrip(data: {
    rideId: string;
    customerId: string;
    driverId: string;
    totalFare: number;
    currency: string;
  }) {
    this.logger.log(`Settling payment for ride ${data.rideId}. Total: ${data.totalFare}`);

    const driverEarning = data.totalFare * (1 - this.COMMISSION_RATE);
    const platformCommission = data.totalFare * this.COMMISSION_RATE;

    try {
      // 1. Debit customer
      await this.walletService.debitWallet(
        data.customerId,
        data.totalFare,
        `Payment for ride ${data.rideId}`,
        `RIDE-PAY-${data.rideId}`,
      );

      // 2. Credit driver
      await this.walletService.creditWallet(
        data.driverId,
        driverEarning,
        `Earning for ride ${data.rideId} (after commission)`,
        `RIDE-EARN-${data.rideId}`,
      );

      this.logger.log(`Ride ${data.rideId} settled. Driver earned: ${driverEarning}, Platform: ${platformCommission}`);

      return {
        status: 'success',
        driverEarning,
        platformCommission,
        reference: `SETTLE-${data.rideId}`,
      };
    } catch (error) {
      this.logger.error(`Payment settlement failed for ride ${data.rideId}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Legacy placeholder for disbursements
   */
  async processPayment(amount: number, currency: string, destination: string) {
    this.logger.log(`Processing payout of ${amount} ${currency} to ${destination}`);
    return {
      status: 'success',
      transactionReference: `TXN-${Date.now()}`,
      processedAt: new Date().toISOString(),
    };
  }
}
