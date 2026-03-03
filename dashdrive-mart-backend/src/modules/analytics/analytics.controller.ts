import { Controller, Get, Query, Param, UseGuards, Req } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { DateRangeDto } from './dto/date-range.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('analytics')
@Controller('analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) { }

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
    @ApiOperation({ summary: 'Get best-performing products by volume and revenue' })
    @ApiResponse({ status: 200, description: 'Return list of top products' })
    getTopProducts(
        @Req() req: any,
        @Query('storeId') storeId: string
    ) {
        return this.analyticsService.getTopProducts(req.user.sub, storeId);
    }

    @Get('revenue-by-currency')
    @ApiOperation({ summary: 'Get financial breakdown by currency (Multi-country support)' })
    @ApiResponse({ status: 200, description: 'Return revenue aggregated by currency' })
    getRevenueByCurrency(
        @Req() req: any,
        @Query('storeId') storeId: string
    ) {
        return this.analyticsService.getRevenueByCurrency(req.user.sub, storeId);
    }

    @Get('order-status')
    @ApiOperation({ summary: 'Get volumetric breakdown of order statuses' })
    @ApiResponse({ status: 200, description: 'Return count per status' })
    getOrderStatusBreakdown(
        @Req() req: any,
        @Query('storeId') storeId: string
    ) {
        return this.analyticsService.getOrderStatusBreakdown(req.user.sub, storeId);
    }
}
