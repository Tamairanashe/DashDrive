import { Controller, Get, Post, Body, Param, Patch, Query, UseGuards, Request } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('wallet')
@Controller('wallet')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class WalletController {
    constructor(private readonly walletService: WalletService) { }

    @Get('balance')
    @ApiOperation({ summary: 'Get current wallet balance' })
    async getBalance(@Request() req: any, @Query('currency') currency: string) {
        // Determine ownerType based on user role (Mock logic for now)
        const ownerType = req.user.role === 'rider' ? 'RIDER' : 'MERCHANT';
        const wallet = await this.walletService.getWallet(ownerType as any, req.user.id, currency || 'USD');
        return { balance: wallet.balance, currency: wallet.currency, isFrozen: wallet.isFrozen };
    }

    @Get('history')
    @ApiOperation({ summary: 'Get transaction history (ledger)' })
    async getHistory(@Request() req: any, @Query('currency') currency: string) {
        const ownerType = req.user.role === 'rider' ? 'RIDER' : 'MERCHANT';
        const wallet = await this.walletService.getWallet(ownerType as any, req.user.id, currency || 'USD');
        return this.walletService.getTransactionHistory(wallet.id);
    }

    @Get('summary')
    @ApiOperation({ summary: 'Get wallet summary (balance + recent transactions)' })
    async getSummary(@Request() req: any, @Query('currency') currency: string) {
        const ownerType = req.user.role === 'rider' ? 'RIDER' : 'MERCHANT';
        return this.walletService.getWalletSummary(ownerType as any, req.user.id, currency || 'USD');
    }

    @Post('withdraw')
    @ApiOperation({ summary: 'Request a withdrawal' })
    async withdraw(@Request() req: any, @Body() data: { amount: number; currency: string }) {
        const ownerType = req.user.role === 'rider' ? 'RIDER' : 'MERCHANT';
        const wallet = await this.walletService.getWallet(ownerType as any, req.user.id, data.currency || 'USD');
        return this.walletService.requestWithdrawal(wallet.id, data.amount);
    }
}
