import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { RiderWalletService } from './rider-wallet.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('rider-wallet')
@Controller('rider/wallet')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class RiderWalletController {
    constructor(private readonly walletService: RiderWalletService) { }

    @Get('summary/:riderId')
    @ApiOperation({ summary: 'Get rider wallet balance and today’s earnings summary' })
    getSummary(@Param('riderId') riderId: string) {
        return this.walletService.getWalletSummary(riderId);
    }

    @Get('history/:riderId')
    @ApiOperation({ summary: 'Get paginated credit transaction history' })
    getHistory(
        @Param('riderId') riderId: string,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        return this.walletService.getTransactionHistory(riderId, page ? Number(page) : 1, limit ? Number(limit) : 20);
    }

    @Post('recharge/:riderId')
    @ApiOperation({ summary: 'Simulate a credit package recharge' })
    recharge(
        @Param('riderId') riderId: string,
        @Body('packageId') packageId: string,
    ) {
        return this.walletService.recharge(riderId, packageId);
    }
}
