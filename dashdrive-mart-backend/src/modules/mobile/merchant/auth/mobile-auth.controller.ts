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
        const { email, password, deviceId, deviceName, pushToken } = body;

        const loginResponse = await this.authService.login(email, password);

        // Update device info after successful login
        const merchant = await this.prisma.merchant.findUnique({
            where: { email },
            select: { id: true, storeName: true, email: true }
        });

        if (merchant && deviceId) {
            await this.prisma.merchantDevice.upsert({
                where: {
                    merchantId_deviceId: {
                        merchantId: merchant.id,
                        deviceId,
                    },
                },
                update: {
                    deviceName,
                    pushToken,
                    lastLogin: new Date(),
                },
                create: {
                    merchantId: merchant.id,
                    deviceId,
                    deviceName,
                    pushToken,
                    lastLogin: new Date(),
                },
            });
        }

        return {
            ...loginResponse,
            merchant,
        };
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Logout and clear device token' })
    async logout(@Body() body: { merchantId: string, deviceId: string }) {
        const { merchantId, deviceId } = body;

        if (merchantId && deviceId) {
            await this.prisma.merchantDevice.update({
                where: {
                    merchantId_deviceId: { merchantId, deviceId }
                },
                data: { pushToken: null }
            });
        }

        return { message: 'Logged out successfully' };
    }
}
