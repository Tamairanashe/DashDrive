import { Injectable } from '@nestjs/common';
import { WalletService } from '../../wallet/wallet.service';

@Injectable()
export class MockPaymentProvider {
    constructor(private walletService: WalletService) {}

    /**
     * Simulates an external gateway processing a top-up
     * In a real world scenario, this would generate a Stripe Checkout URL
     * and wait for a webhook.
     */
    async generateTopUpSession(walletId: string, amount: number, currency: string) {
        const sessionId = `mock_session_${Date.now()}`;
        return {
            sessionId,
            paymentUrl: `https://dashdrive.mock/pay/${sessionId}?walletId=${walletId}&amount=${amount}`,
        };
    }

    /**
     * Simulates the receipt of a successful top-up from the gateway
     */
    async simulateSuccessfulTopUp(walletId: string, amount: number, gatewayTransactionId: string) {
        return this.walletService.credit(
            walletId,
            amount,
            gatewayTransactionId,
            `Top up via MockGateway - Tx: ${gatewayTransactionId}`,
        );
    }
}
