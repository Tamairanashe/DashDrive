import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { MerchantsService } from './merchants.service';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

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
}
