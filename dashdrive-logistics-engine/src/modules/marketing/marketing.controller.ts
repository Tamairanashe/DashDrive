import { Controller, Get, Post, Body, Query, UseGuards, Req } from '@nestjs/common';
import { MarketingService } from './marketing.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiResponse } from '@nestjs/swagger';

@ApiTags('marketing')
@Controller('marketing')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MarketingController {
    constructor(private readonly marketingService: MarketingService) { }

    @Get('stats')
    @ApiOperation({ summary: 'Get marketing statistics overview' })
    @ApiQuery({ name: 'storeId', required: false })
    getStats(@Req() req: any, @Query('storeId') storeId?: string) {
        return this.marketingService.getMarketingStats(req.user.sub, storeId);
    }

    @Get('campaign-impact')
    @ApiOperation({ summary: 'Get campaign impact data for charts' })
    @ApiQuery({ name: 'storeId', required: false })
    getCampaignImpact(@Req() req: any, @Query('storeId') storeId?: string) {
        return this.marketingService.getCampaignImpact(req.user.sub, storeId);
    }

    @Get('featured-items')
    @ApiOperation({ summary: 'Get featured/boosted items' })
    @ApiQuery({ name: 'storeId', required: false })
    getFeaturedItems(@Req() req: any, @Query('storeId') storeId?: string) {
        return this.marketingService.getFeaturedItems(req.user.sub, storeId);
    }

    @Post('promotions')
    @ApiOperation({ summary: 'Create a new promotion' })
    createPromotion(@Req() req: any, @Body() data: any) {
        return this.marketingService.createPromotion(req.user.sub, data);
    }

    @Post('coupons')
    @ApiOperation({ summary: 'Create a new coupon' })
    createCoupon(@Req() req: any, @Body() data: any) {
        return this.marketingService.createCoupon(req.user.sub, data);
    }

    @Post('featured-items')
    @ApiOperation({ summary: 'Boost an item (Feature it)' })
    createFeaturedItem(@Req() req: any, @Body() data: any) {
        return this.marketingService.createFeaturedItem(req.user.sub, data);
    }

    @Get('promotions')
    @ApiOperation({ summary: 'List all promotions' })
    @ApiQuery({ name: 'storeId', required: false })
    getPromotions(@Req() req: any, @Query('storeId') storeId?: string) {
        return this.marketingService.getPromotions(req.user.sub, storeId);
    }

    @Get('coupons')
    @ApiOperation({ summary: 'List all coupons' })
    @ApiQuery({ name: 'storeId', required: false })
    getCoupons(@Req() req: any, @Query('storeId') storeId?: string) {
        return this.marketingService.getCoupons(req.user.sub, storeId);
    }
}
