import { Controller, Get, Put, Body, UseGuards, Request, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { MerchantsService } from '../../../merchants/merchants.service';
import { StoresService } from '../../../stores/stores.service';
import { BusinessHoursService } from './business-hours.service';

@ApiTags('mobile/merchant/store')
@Controller('mobile/merchant/store')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class MobileSettingsController {
    constructor(
        private readonly merchantsService: MerchantsService,
        private readonly storesService: StoresService,
        private readonly businessHoursService: BusinessHoursService,
    ) { }

    @Get('profile')
    @ApiOperation({ summary: 'Get store/merchant profile' })
    async getProfile(@Request() req: any) {
        return this.merchantsService.getProfile(req.user.sub);
    }

    @Put()
    @ApiOperation({ summary: 'Update store details' })
    async updateStore(@Request() req: any, @Body() body: any) {
        // Find the first store for this merchant (or handle multi-store if needed)
        const profile = await this.merchantsService.getProfile(req.user.sub);
        const storeId = profile?.stores[0]?.id;
        if (!storeId) throw new Error('Store not found');

        return this.storesService.update(storeId, req.user.sub, body);
    }

    @Get('hours')
    @ApiOperation({ summary: 'Get business hours' })
    async getHours(@Request() req: any) {
        const profile = await this.merchantsService.getProfile(req.user.sub);
        const storeId = profile?.stores[0]?.id;
        if (!storeId) throw new Error('Store not found');

        return this.businessHoursService.getHours(storeId);
    }

    @Put('hours')
    @ApiOperation({ summary: 'Update business hours' })
    async updateHours(@Request() req: any, @Body() body: { hours: any[] }) {
        const profile = await this.merchantsService.getProfile(req.user.sub);
        const storeId = profile?.stores[0]?.id;
        if (!storeId) throw new Error('Store not found');

        return this.businessHoursService.updateHours(storeId, body.hours);
    }
}
