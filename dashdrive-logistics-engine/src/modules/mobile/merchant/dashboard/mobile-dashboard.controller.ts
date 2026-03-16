import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { AnalyticsService } from '../../../analytics/analytics.service';
import { WalletService } from '../../../wallet/wallet.service';

@ApiTags('mobile/merchant/dashboard')
@Controller('mobile/merchant/dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class MobileDashboardController {
  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly walletService: WalletService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get dashboard summary for merchant mobile app' })
  async getDashboard(@Request() req: any, @Query('storeId') storeId?: string) {
    const merchantId = req.user.sub;

    const [stats, walletSummary] = await Promise.all([
      this.analyticsService.getMobileTodayStats(merchantId, storeId),
      this.walletService.getWalletSummary('MERCHANT', merchantId, 'USD'), // Default to USD for now or fetch from merchant country
    ]);

    return {
      todayRevenue: stats.revenue,
      todayOrders: stats.todayOrders,
      pendingOrders: stats.pendingOrders,
      lowStockCount: stats.lowStockAlerts,
      walletBalance: walletSummary.balance,
      recentOrders: stats.recentOrders,
    };
  }
}
