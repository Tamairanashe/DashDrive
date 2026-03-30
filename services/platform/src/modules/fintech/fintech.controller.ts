import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';

@Controller('fintech')
export class FintechController {
  constructor(private walletService: WalletService) {}

  @Get('wallet/:userId')
  getWallet(@Param('userId') userId: string) {
    return this.walletService.getWallet(userId);
  }

  @Post('wallet/topup')
  topup(@Body() body: { userId: string; amount: number; reference: string }) {
    return this.walletService.creditWallet(
      body.userId, 
      body.amount, 
      'Wallet top-up', 
      body.reference
    );
  }

  @Post('transfer')
  transfer(@Body() body: { senderId: string; receiverId: string; amount: number }) {
    return this.walletService.transfer(body.senderId, body.receiverId, body.amount);
  }

  @Get('transactions/:userId')
  getTransactions(@Param('userId') userId: string) {
    return this.walletService.getWallet(userId).then(w => w.transactions);
  }

  @Post('bill-pay')
  payBill(@Body() body: { userId: string; provider: string; account: string; amount: number }) {
    return this.walletService.debitWallet(
      body.userId, 
      body.amount, 
      `Bill Payment: ${body.provider} (${body.account})`
    );
  }

  @Post('merchant-pay')
  payMerchant(@Body() body: { userId: string; merchantId: string; amount: number }) {
    return this.walletService.debitWallet(
      body.userId, 
      body.amount, 
      `Merchant Payment: ${body.merchantId}`
    );
  }
}
