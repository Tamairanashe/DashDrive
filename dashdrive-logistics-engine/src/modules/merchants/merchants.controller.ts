import { Controller, Get, Post, Body, UseGuards, Req, Patch } from '@nestjs/common';
import { MerchantsService } from './merchants.service';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UpdatePushTokenDto } from './dto/update-push-token.dto';

@ApiTags('merchants')
@Controller('merchants')
export class MerchantsController {
    constructor(private readonly merchantsService: MerchantsService) { }

    @Post('register')
    @ApiOperation({ summary: 'Register a new merchant' })
    @ApiResponse({ status: 201, description: 'Merchant successfully registered' })
    register(@Body() createMerchantDto: CreateMerchantDto) {
        return this.merchantsService.register(createMerchantDto);
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get current merchant profile' })
    @ApiResponse({ status: 200, description: 'Return merchant profile data' })
    getProfile(@Req() req: any) {
        return this.merchantsService.getProfile(req.user.sub);
    }

    @Patch('push-token')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update merchant FCM push token' })
    @ApiResponse({ status: 200, description: 'Token updated successfully' })
    updatePushToken(@Req() req: any, @Body() updateDto: UpdatePushTokenDto) {
        return this.merchantsService.updatePushToken(req.user.sub, updateDto.pushToken);
    }

    @Post('store/onboard')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Submit store onboarding data' })
    @ApiResponse({ status: 201, description: 'Onboarding data submitted for review' })
    onboardStore(@Req() req: any, @Body() data: any) {
        return this.merchantsService.onboardStore(req.user.sub, data);
    }
}
