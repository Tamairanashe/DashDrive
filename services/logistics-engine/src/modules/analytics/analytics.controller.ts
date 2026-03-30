import { Controller, Get, Query, Param, UseGuards, Req } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { PredictionService } from './prediction.service';
import { DateRangeDto } from './dto/date-range.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('analytics')
@Controller('analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly predictionService: PredictionService,
  ) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get overall merchant or store-specific KPIs' })
  @ApiResponse({ status: 200, description: 'Return high-level metrics' })
  getDashboard(
    @Req() req: any,
    @Query('storeId') storeId: string,
    @Query() query: DateRangeDto,
  ) {
    return this.analyticsService.getDashboardMetrics(
      req.user.sub,
      storeId,
      query.startDate,
      query.endDate,
    );
  }

  @Get('sales')
  @ApiOperation({ summary: 'Get daily sales trends for charts' })
  @ApiResponse({ status: 200, description: 'Return time-series sales data' })
  getSalesOverTime(
    @Req() req: any,
    @Query('storeId') storeId: string,
    @Query() query: DateRangeDto,
  ) {
    return this.analyticsService.getSalesOverTime(
      req.user.sub,
      storeId,
      query.startDate,
      query.endDate,
    );
  }

  @Get('top-products')
  @ApiOperation({
    summary: 'Get best-performing products by volume and revenue',
  })
  @ApiResponse({ status: 200, description: 'Return list of top products' })
  getTopProducts(@Req() req: any, @Query('storeId') storeId: string) {
    return this.analyticsService.getTopProducts(req.user.sub, storeId);
  }

  @Get('revenue-by-currency')
  @ApiOperation({
    summary: 'Get financial breakdown by currency (Multi-country support)',
  })
  @ApiResponse({
    status: 200,
    description: 'Return revenue aggregated by currency',
  })
  getRevenueByCurrency(@Req() req: any, @Query('storeId') storeId: string) {
    return this.analyticsService.getRevenueByCurrency(req.user.sub, storeId);
  }

  @Get('order-status')
  @ApiOperation({ summary: 'Get volumetric breakdown of order statuses' })
  @ApiResponse({ status: 200, description: 'Return count per status' })
  getOrderStatusBreakdown(@Req() req: any, @Query('storeId') storeId: string) {
    return this.analyticsService.getOrderStatusBreakdown(req.user.sub, storeId);
  }

  @Get('country-performance')
  @ApiOperation({ summary: 'Get performance metrics by country' })
  @ApiResponse({
    status: 200,
    description: 'Return revenue and orders by country',
  })
  getCountryPerformance(@Req() req: any) {
    return this.analyticsService.getCountryPerformance(req.user.sub);
  }

  @Get('mobile/today')
  @ApiOperation({ summary: 'Get aggregated today stats for mobile dashboard' })
  @ApiResponse({
    status: 200,
    description: 'Return today metrics and recent orders',
  })
  getMobileTodayStats(@Req() req: any, @Query('storeId') storeId?: string) {
    return this.analyticsService.getMobileTodayStats(req.user.sub, storeId);
  }

  // --- Global Admin Endpoints ---

  @Get('global/stats')
  @ApiOperation({ summary: 'Get global platform-wide statistics (Admin Only)' })
  @ApiResponse({ status: 200, description: 'Return global KPIs' })
  getGlobalStats() {
    return this.analyticsService.getGlobalPlatformStats();
  }

  @Get('global/financials')
  @ApiOperation({ summary: 'Get global financial snapshots (Admin Only)' })
  @ApiResponse({ status: 200, description: 'Return GMV and Revenue snapshots' })
  getGlobalFinancials() {
    return this.analyticsService.getGlobalFinancials();
  }

  @Get('global/demand')
  @ApiOperation({ summary: 'Get real-time demand intensity heatmap data' })
  @ApiResponse({ status: 200, description: 'Return density data by location' })
  getDemandIntensity(@Query('timezone') timezone?: string) {
    return this.analyticsService.getDemandIntensity(timezone);
  }

  @Get('prediction/demand')
  @ApiOperation({ summary: 'Get AI-powered demand forecasting for a city' })
  @ApiResponse({ status: 200, description: 'Return hourly demand forecast' })
  getDemandForecast(@Query('city') city: string) {
    return this.predictionService.getDemandForecast(city);
  }
}
