import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PaymentStatus, RiskEventType, RiskActorType, RiskDecision, WalletOwnerType } from '@prisma/client';
import { FraudService } from '../fraud/fraud.service';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class PaymentsService {
    constructor(
        private prisma: PrismaService,
        private fraudService: FraudService,
        private walletService: WalletService, // Added WalletService
    ) { }

    async initiatePayment(orderId: string, merchantId: string) {
        const order = await this.prisma.order.findFirst({
            where: { id: orderId, merchantId },
            include: {
                store: {
                    include: {
                        merchant: {
                            include: { country: true },
                        },
                    },
                },
            },
        });

        if (!order) throw new NotFoundException('Order not found or unauthorized');

        // Risk Evaluation
        const risk = await this.fraudService.evaluate(
            RiskEventType.PAYMENT,
            order.merchantId, // Evaluating the merchant context here
            RiskActorType.MERCHANT,
            order.id,
            { amount: order.totalAmount, currency: order.currency }
        );

        if (risk.decision === RiskDecision.BLOCKED) {
            throw new BadRequestException('Payment blocked due to security risk');
        }

        const countryCode = order.store.merchant.country.code;
        const gateway = this.resolveGateway(countryCode);

        const transaction = await this.prisma.transaction.create({
            data: {
                orderId: order.id,
                storeId: order.storeId,
                merchantId: order.merchantId,
                gateway,
                currency: order.currency,
                amount: order.totalAmount,
                status: PaymentStatus.PENDING,
            },
        });

        // Route to appropriate gateway (Mock integration)
        const paymentUrl = await this.processGatewayPayment(
            gateway,
            transaction,
            order,
        );

        return {
            transactionId: transaction.id,
            gateway,
            paymentUrl,
            amount: order.totalAmount,
            currency: order.currency,
        };
    }

    /**
     * Complete a payment and move funds to Platform Escrow (Double-Entry Initialization)
     */
    async completePayment(transactionId: string, gatewayTransactionId: string) {
        const transaction = await this.prisma.transaction.findUnique({
            where: { id: transactionId },
            include: { order: true },
        });

        if (!transaction || transaction.status !== PaymentStatus.PENDING) {
            throw new BadRequestException('Invalid transaction or already processed');
        }

        return this.prisma.$transaction(async (tx) => {
            // 1. Update Transaction Status
            const updatedTransaction = await tx.transaction.update({
                where: { id: transactionId },
                data: {
                    status: PaymentStatus.SUCCESS,
                    gatewayTransactionId,
                },
            });

            // 2. Load Escrow Wallet
            const escrowWallet = await this.walletService.getWallet(
                WalletOwnerType.PLATFORM,
                'PLATFORM_ESCROW',
                transaction.currency,
            );

            // 3. Credit Escrow Wallet (Movement from external gateway to internal system)
            await this.walletService.credit(
                escrowWallet.id,
                transaction.amount,
                transaction.id,
                `Escrow for Order #${transaction.order.orderNumber}`
            );

            return updatedTransaction;
        });
    }

    private resolveGateway(countryCode: string): string {
        switch (countryCode) {
            case 'ZW':
                return 'paynow';
            case 'NG':
                return 'paystack';
            case 'KE':
                return 'flutterwave';
            case 'ZA':
                return 'yoco';
            default:
                return 'stripe';
        }
    }

    private async processGatewayPayment(
        gateway: string,
        transaction: any,
        order: any,
    ) {
        // Placeholder URLs (In production, this would call the gateway's API to create a session)
        if (gateway === 'stripe') {
            return `https://checkout.stripe.com/pay/${transaction.id}?order=${order.orderNumber}`;
        }

        if (gateway === 'paystack') {
            return `https://paystack.com/pay/${transaction.id}?ref=${order.orderNumber}`;
        }

        if (gateway === 'paynow') {
            return `https://paynow.co.zw/payment/${transaction.id}`;
        }

        if (gateway === 'flutterwave') {
            return `https://checkout.flutterwave.com/pay/${transaction.id}`;
        }

        return `https://dashdrive.mart/checkout/mock/${transaction.id}`;
    }
}
