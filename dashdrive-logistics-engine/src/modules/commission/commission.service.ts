import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { WalletService } from '../wallet/wallet.service';
import { WalletOwnerType } from '@prisma/client';

@Injectable()
export class CommissionService {
    private readonly logger = new Logger(CommissionService.name);

    constructor(
        private prisma: PrismaService,
        private walletService: WalletService,
    ) { }

    /**
     * Automated settlement for a completed order.
     * Splits total amount between Platform, Merchant, and Rider.
     */
    async processOrderSettlement(orderId: string) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: {
                store: {
                    include: {
                        merchant: true,
                    },
                },
                delivery: true,
            },
        });

        if (!order) throw new NotFoundException('Order not found');

        const currency = order.currency;
        const subtotal = order.subtotal;
        const deliveryFee = order.deliveryFee;

        // 1. Calculate Splits (Business Logic)
        let platformCommission = 0;
        let merchantEarned = 0;
        let riderEarned = 0;

        if (order.store.merchant.type === 'DIRECT') {
            // Direct orders: Fixed platform booking fee, rest goes to rider
            const bookingFee = 2.0; // Fixed fee
            platformCommission = bookingFee;
            riderEarned = Math.max(0, deliveryFee - bookingFee);
            merchantEarned = subtotal; // Subtotal usually 0 for direct, but if not, merchant keeps it
        } else {
            // Food & Mart
            // Platform Fee: Use store-specific commissionRate (defaults to 0.10 in schema)
            const commissionRate = order.store.commissionRate || 0.10;
            platformCommission = subtotal * commissionRate;

            // Merchant Payout: Subtotal - Platform Fee
            merchantEarned = subtotal - platformCommission;

            // Rider Earned: Based on vertical
            let riderPayoutRate = 0.80; // Default for Food
            if (order.store.merchant.type === 'MART') riderPayoutRate = 0.70;
            
            riderEarned = deliveryFee * riderPayoutRate;
        }

        this.logger.log(`Settling Order #${order.orderNumber}: Platform(${platformCommission}), Merchant(${merchantEarned}), Rider(${riderEarned})`);

        // 2. Execute Wallet Movements (Double-Entry Ledger)
        const escrowWallet = await this.walletService.getWallet(WalletOwnerType.PLATFORM, 'PLATFORM_ESCROW', currency);

        // A. Transfer to Merchant Wallet
        const merchantWallet = await this.walletService.getWallet(WalletOwnerType.MERCHANT, order.merchantId, currency);
        await this.walletService.transfer(
            escrowWallet.id,
            merchantWallet.id,
            merchantEarned,
            order.id,
            `Payout for Order #${order.orderNumber}`
        );

        // B. Transfer to Rider Wallet (if assigned)
        if (order.delivery?.riderId) {
            const riderWallet = await this.walletService.getWallet(WalletOwnerType.RIDER, order.delivery.riderId, currency);
            await this.walletService.transfer(
                escrowWallet.id,
                riderWallet.id,
                riderEarned,
                order.id,
                `Delivery fee for Order #${order.orderNumber}`
            );
        }

        // C. Transfer to Platform Revenue Wallet
        const platformWallet = await this.walletService.getWallet(WalletOwnerType.PLATFORM, 'PLATFORM_REVENUE', currency);
        await this.walletService.transfer(
            escrowWallet.id,
            platformWallet.id,
            platformCommission,
            order.id,
            `Commission for Order #${order.orderNumber}`
        );

        return {
            platformCommission,
            merchantEarned,
            riderEarned,
        };
    }
}
