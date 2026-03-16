import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { WalletService } from '../../../wallet/wallet.service';

@ApiTags('mobile/merchant/wallet')
@Controller('mobile/merchant/wallet')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class MobileWalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  @ApiOperation({ summary: 'Get wallet overview for merchant mobile app' })
  async getOverview(@Request() req: any) {
    const merchantId = req.user.sub;
    const wallet = await this.walletService.getWallet(
      'MERCHANT',
      merchantId,
      'USD',
    );

    // Count pending withdrawals
    const pendingWithdrawalsCount = await (
      this.walletService as any
    ).prisma.withdrawalRequest.count({
      where: { walletId: wallet.id, status: 'PENDING' },
    });

    return {
      balance: wallet.balance,
      pendingWithdrawals: pendingWithdrawalsCount,
      currency: wallet.currency,
    };
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get recent transactions' })
  async getTransactions(@Request() req: any) {
    const summary = await this.walletService.getWalletSummary(
      'MERCHANT',
      req.user.sub,
      'USD',
    );
    return summary.recentTransactions;
  }

  @Post('withdraw')
  @ApiOperation({ summary: 'Request a withdrawal' })
  async withdraw(@Request() req: any, @Body() body: { amount: number }) {
    const wallet = await this.walletService.getWallet(
      'MERCHANT',
      req.user.sub,
      'USD',
    );
    return this.walletService.requestWithdrawal(wallet.id, body.amount);
  }
}
