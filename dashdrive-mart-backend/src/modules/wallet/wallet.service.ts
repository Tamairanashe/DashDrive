import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { WalletOwnerType, LedgerType, WithdrawalStatus, RiskEventType, RiskActorType, RiskDecision } from '@prisma/client';
import { FraudService } from '../fraud/fraud.service';

@Injectable()
export class WalletService {
    constructor(
        private prisma: PrismaService,
        private fraudService: FraudService,
    ) { }

    async getWallet(ownerType: WalletOwnerType, ownerId: string, currency: string) {
        let wallet = await this.prisma.wallet.findUnique({
            where: {
                ownerType_ownerId_currency: { ownerType, ownerId, currency },
            },
        });

        if (!wallet) {
            wallet = await this.createWallet(ownerType, ownerId, currency);
        }

        return wallet;
    }

    async createWallet(ownerType: WalletOwnerType, ownerId: string, currency: string) {
        return this.prisma.wallet.create({
            data: {
                ownerType,
                ownerId,
                currency,
                balance: 0,
            },
        });
    }

    /**
     * Credit funds to a wallet with a ledger entry
     */
    async credit(walletId: string, amount: number, referenceId?: string, description?: string) {
        if (amount <= 0) throw new BadRequestException('Amount must be positive');

        const wallet = await this.prisma.wallet.findUnique({ where: { id: walletId } });
        if (!wallet) throw new NotFoundException('Wallet not found');
        if (wallet.isFrozen) throw new BadRequestException('Wallet is frozen');

        return this.prisma.$transaction(async (tx) => {
            // 1. Create Ledger Entry
            await tx.ledgerEntry.create({
                data: {
                    walletId,
                    amount,
                    type: LedgerType.CREDIT,
                    referenceId,
                    description,
                },
            });

            // 2. Update Wallet Balance
            return tx.wallet.update({
                where: { id: walletId },
                data: {
                    balance: { increment: amount },
                },
            });
        });
    }

    /**
     * Debit funds from a wallet with a ledger entry (Double-entry logic)
     */
    async debit(walletId: string, amount: number, referenceId?: string, description?: string) {
        if (amount <= 0) throw new BadRequestException('Amount must be positive');

        const wallet = await this.prisma.wallet.findUnique({ where: { id: walletId } });
        if (!wallet) throw new NotFoundException('Wallet not found');
        if (wallet.isFrozen) throw new BadRequestException('Wallet is frozen');
        if (wallet.balance < amount) throw new BadRequestException('Insufficient balance');

        return this.prisma.$transaction(async (tx) => {
            // 1. Create Ledger Entry
            await tx.ledgerEntry.create({
                data: {
                    walletId,
                    amount,
                    type: LedgerType.DEBIT,
                    referenceId,
                    description,
                },
            });

            // 2. Update Wallet Balance
            return tx.wallet.update({
                where: { id: walletId },
                data: {
                    balance: { decrement: amount },
                },
            });
        });
    }

    /**
     * Process a withdrawal request
     */
    async requestWithdrawal(walletId: string, amount: number) {
        const wallet = await this.prisma.wallet.findUnique({ where: { id: walletId } });
        if (!wallet || wallet.balance < amount) {
            throw new BadRequestException('Insufficient balance or wallet not found');
        }

        // 1. Evaluate Fraud Risk
        const risk = await this.fraudService.evaluate(
            RiskEventType.WITHDRAWAL,
            wallet.ownerId,
            wallet.ownerType as unknown as RiskActorType,
            wallet.id,
            { amount, currency: wallet.currency }
        );

        if (risk.decision === RiskDecision.BLOCKED) {
            throw new BadRequestException('Withdrawal blocked due to high security risk');
        }

        return this.prisma.withdrawalRequest.create({
            data: {
                walletId,
                amount,
                status: risk.decision === RiskDecision.REVIEW ? WithdrawalStatus.PENDING : WithdrawalStatus.APPROVED,
            },
        });
    }

    /**
     * Approve and complete a withdrawal
     */
    async approveWithdrawal(requestId: string) {
        const request = await this.prisma.withdrawalRequest.findUnique({
            where: { id: requestId },
            include: { wallet: true },
        });

        if (!request || request.status !== WithdrawalStatus.PENDING) {
            throw new BadRequestException('Invalid withdrawal request or already processed');
        }

        // Debit the wallet first
        await this.debit(
            request.walletId,
            request.amount,
            request.id,
            `Withdrawal completion: ${request.id}`
        );

        return this.prisma.withdrawalRequest.update({
            where: { id: requestId },
            data: { status: WithdrawalStatus.COMPLETED },
        });
    }

    async getTransactionHistory(walletId: string) {
        return this.prisma.ledgerEntry.findMany({
            where: { walletId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async setFrozenStatus(walletId: string, isFrozen: boolean) {
        return this.prisma.wallet.update({
            where: { id: walletId },
            data: { isFrozen },
        });
    }

    /**
     * Atomic transfer between two wallets (True Double-Entry)
     */
    async transfer(
        fromWalletId: string,
        toWalletId: string,
        amount: number,
        referenceId?: string,
        description?: string,
    ) {
        if (amount <= 0) throw new BadRequestException('Amount must be positive');

        return this.prisma.$transaction(async (tx) => {
            const fromWallet = await tx.wallet.findUnique({ where: { id: fromWalletId } });
            if (!fromWallet || fromWallet.balance < amount) {
                throw new BadRequestException('Insufficient balance or source wallet not found');
            }
            if (fromWallet.isFrozen) throw new BadRequestException('Source wallet is frozen');

            const toWallet = await tx.wallet.findUnique({ where: { id: toWalletId } });
            if (!toWallet) throw new NotFoundException('Destination wallet not found');
            if (toWallet.isFrozen) throw new BadRequestException('Destination wallet is frozen');

            // 1. Debit Source
            await tx.ledgerEntry.create({
                data: {
                    walletId: fromWalletId,
                    amount,
                    type: LedgerType.DEBIT,
                    referenceId,
                    description: description ? `Transfer to ${toWalletId}: ${description}` : `Transfer to ${toWalletId}`,
                },
            });

            await tx.wallet.update({
                where: { id: fromWalletId },
                data: { balance: { decrement: amount } },
            });

            // 2. Credit Destination
            await tx.ledgerEntry.create({
                data: {
                    walletId: toWalletId,
                    amount,
                    type: LedgerType.CREDIT,
                    referenceId,
                    description: description ? `Transfer from ${fromWalletId}: ${description}` : `Transfer from ${fromWalletId}`,
                },
            });

            await tx.wallet.update({
                where: { id: toWalletId },
                data: { balance: { increment: amount } },
            });
        });
    }
}
