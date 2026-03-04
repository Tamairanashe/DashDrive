import { Controller, Post, Body, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from '../../../auth/auth.service';
import { PrismaService } from '../../../../prisma/prisma.service';

@ApiTags('mobile/merchant/auth')
@Controller('mobile/merchant/auth')
export class MobileAuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly prisma: PrismaService,
    ) { }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Login for merchant mobile app' })
    @ApiResponse({ status: 200, description: 'Login successful' })
    async login(@Body() body: any) {
        const { email, password, deviceId, deviceName } = body;

        const loginResponse = await this.authService.login(email, password);

        // Update device info after successful login
        const merchant = await this.prisma.merchant.findUnique({
            where: { email },
            select: { id: true, storeName: true, email: true }
        });

        if (merchant && (deviceId || deviceName)) {
            await this.prisma.merchant.update({
                where: { id: merchant.id },
                data: { deviceId, deviceName },
            });
        }

        return {
            ...loginResponse,
            merchant,
        };
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Logout and clear device info' })
    async logout(@Body() body: any) {
        // In a real app, you might invalidate the JWT or clear push tokens here
        return { message: 'Logged out successfully' };
    }
}
