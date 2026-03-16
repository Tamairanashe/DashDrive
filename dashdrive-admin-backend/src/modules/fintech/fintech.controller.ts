import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { LeadService } from './lead.service';
import { WebhookService } from './webhook.service';
import { MatchingService, UserProfile, FinancialProduct } from './matching.service';
import { FintechProductType, WalletOwnerType } from '@prisma/client';
import { WalletService } from './wallet.service';
import { PaymentService } from './payment.service';
import { UtilityService } from './utility.service';
import { InsuranceService } from './insurance.service';
import { ComplianceService } from './compliance.service';

import { BillerService } from './biller.service';
import { ProviderService } from './provider.service';

@Controller('fintech')
export class FintechController {
  constructor(
    private leadService: LeadService,
    private webhookService: WebhookService,
    private matchingService: MatchingService,
    private walletService: WalletService,
    private paymentService: PaymentService,
    private utilityService: UtilityService,
    private insuranceService: InsuranceService,
    private complianceService: ComplianceService,
    private billerService: BillerService,
    private providerService: ProviderService,
  ) {}

  @Get('billers')
  async getBillers() {
    return this.billerService.listActive();
  }

  @Post('billers/seed')
  async seedBillers() {
    await this.billerService.seedDefaultBillers();
    return { success: true };
  }

  // --- Payments API ---
  @Post('payments')
  async createPayment(@Body() data: any) {
    return this.paymentService.createPayment(data);
  }

  @Get('payments/:id')
  async getPaymentStatus(@Param('id') id: string) {
    return this.paymentService.getStatus(id);
  }

  @Post('payments/refund')
  async refundPayment(@Body() data: { transaction_id: string; refund_amount: number; reason: string }) {
    return this.paymentService.refund(data.transaction_id, data.refund_amount, data.reason);
  }

  // --- Wallet API ---
  @Post('wallets')
  async createWallet(@Body() data: { owner_id: string; owner_type: WalletOwnerType; currency?: string }) {
    return this.walletService.createWallet(data.owner_id, data.owner_type, data.currency);
  }

  @Get('wallets/:id')
  async getWalletBalance(@Param('id') id: string) {
    return this.walletService.getBalance(id);
  }

  @Post('wallets/credit')
  async creditWallet(@Body() data: { wallet_id: string; amount: number; reason: string }) {
    return this.walletService.credit(data.wallet_id, data.amount, data.reason);
  }

  @Post('wallets/debit')
  async debitWallet(@Body() data: { wallet_id: string; amount: number; reason: string }) {
    return this.walletService.debit(data.wallet_id, data.amount, data.reason);
  }

  @Post('wallets/transfer')
  async transferWallet(@Body() data: { from_wallet: string; to_wallet: string; amount: number; reason?: string }) {
    return this.walletService.transfer(data.from_wallet, data.to_wallet, data.amount, data.reason);
  }

  @Get('wallets/lookup/:identifier')
  async lookupRecipient(@Param('identifier') identifier: string, @Query('currency') currency: string = 'USD') {
    return this.walletService.findWalletByIdentifier(identifier, currency);
  }

  @Post('wallets/transfer-p2p')
  async transferP2P(@Body() data: { 
    from_wallet_id: string; 
    recipient_identifier: string; 
    amount: number; 
    reason?: string;
    currency?: string;
  }) {
    const { wallet: toWallet } = await this.walletService.findWalletByIdentifier(
        data.recipient_identifier, 
        data.currency || 'USD'
    );
    
    return this.walletService.transfer(
        data.from_wallet_id, 
        toWallet.id, 
        data.amount, 
        data.reason || 'P2P Transfer'
    );
  }

  // --- Bills & Utilities ---
  @Post('bills/verify')
  async verifyBill(@Body() data: { provider: string; account_number: string }) {
    return this.utilityService.verifyBill(data.provider, data.account_number);
  }

  @Post('bills/pay')
  async payBill(@Body() data: { provider: string; account_number: string; amount: number; user_id?: string }) {
    return this.utilityService.payBill({
        provider: data.provider,
        accountNumber: data.account_number,
        amount: data.amount,
        currency: 'USD',
        userId: data.user_id || 'THIRD_PARTY_USER'
    });
  }

  @Post('airtime/topup')
  async topupAirtime(@Body() data: { phone_number: string; network: string; amount: number }) {
    return this.utilityService.topupAirtime(data.phone_number, data.network, data.amount);
  }

  @Post('data/purchase')
  async purchaseData(@Body() data: { phone_number: string; bundle_id: string }) {
    return this.utilityService.purchaseData(data.phone_number, data.bundle_id);
  }

  // --- Insurance ---
  @Post('insurance/policies')
  async createPolicy(@Body() data: { policy_type: string; ride_id: string; coverage_amount: number }) {
    return (this.insuranceService as any).createPolicy({
        policyType: data.policy_type,
        rideId: data.ride_id,
        coverageAmount: data.coverage_amount
    });
  }

  @Post('insurance/claims')
  async fileClaim(@Body() data: { policy_id: string; incident_description: string }) {
    return this.insuranceService.fileClaim(data.policy_id, data.incident_description);
  }

  // --- Compliance ---
  @Post('kyc/verify')
  async verifyKyc(@Body() data: { user_id: string; id_number: string }) {
    return this.complianceService.verifyKyc(data.user_id, data.id_number);
  }

  @Post('compliance/aml')
  async checkAml(@Body() data: { user_id: string }) {
    return this.complianceService.checkAml(data.user_id);
  }

  // --- Admin Monitoring ---
  @Get('admin/transactions')
  async getAllTransactions() {
    return this.paymentService.getAllTransactions();
  }

  @Get('admin/wallet-ledger/:walletId')
  async getWalletLedger(@Param('walletId') walletId: string) {
    return this.walletService.getLedger(walletId);
  }

  // --- Provider Management ---
  @Get('admin/providers')
  async listProviders() {
    return this.providerService.listProviders();
  }

  @Get('admin/providers/:key')
  async getProvider(@Param('key') key: string) {
    return this.providerService.getProvider(key);
  }

  @Post('admin/providers/:key')
  async upsertProvider(@Param('key') key: string, @Body() data: any) {
    return this.providerService.upsertProvider(key, data);
  }

  @Post('admin/providers/:key/delete')
  async deleteProvider(@Param('key') key: string) {
    return this.providerService.deleteProvider(key);
  }

  // --- Existing Lead/Matching Endpoints ---
  @Post('leads')
  async createLead(@Body() data: any) {
    return this.leadService.createLead(data);
  }

  @Post('matching/rank')
  async rankOffers(@Body() data: { user: UserProfile; products: FinancialProduct[]; config?: any }) {
    return this.matchingService.rankOffers(data.user, data.products, data.config);
  }

  @Post('webhooks/paynow')
  async paynowWebhook(@Body() payload: any) {
    return this.webhookService.handlePaynowWebhook(payload);
  }

  @Post('bundles/purchase')
  async purchaseBundle(@Body() data: {
    riderId: string;
    bundleId: string;
    amount: number;
    currency: string;
    rides: number;
    expiryDays: number;
  }) {
    return this.paymentService.initiateBundlePurchase(data);
  }

  @Get('bundles/rider/:id')
  async getRiderBundles(@Param('id') id: string) {
    return this.paymentService.getRiderBundles(id);
  }

  @Post('webhooks/postback')

  @Get('leads/:uuid')
  async getLead(@Param('uuid') uuid: string) {
    return this.leadService.getLeadByUuid(uuid);
  }
}
