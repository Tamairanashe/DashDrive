import { Controller, Post, Body, Patch, Param, Get, UseGuards } from '@nestjs/common';
import { RidersService } from './riders.service';
import { VerificationService } from './verification.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { VerificationStatus } from '@prisma/client';

@ApiTags('riders')
@Controller('riders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class RidersController {
    constructor(
        private readonly ridersService: RidersService,
        private readonly verificationService: VerificationService
    ) { }

    @Get('pending')
    @ApiOperation({ summary: 'Get riders awaiting verification' })
    getPending() {
        return this.verificationService.getPendingRiders();
    }

    @Patch(':id/verify')
    @ApiOperation({ summary: 'Verify or reject a rider' })
    verify(
        @Param('id') id: string, 
        @Body('status') status: VerificationStatus,
        @Body('note') note?: string
    ) {
        return this.verificationService.verifyRider(id, status, note);
    }
    
    // ... (rest of the endpoints)

    @Post()
    @ApiOperation({ summary: 'Register a new rider' })
    create(@Body() data: any) {
        return this.ridersService.create(data);
    }

    @Patch(':id/status')
    @ApiOperation({ summary: 'Update rider online/offline status' })
    setStatus(@Param('id') id: string, @Body('isOnline') isOnline: boolean) {
        return this.ridersService.setOnlineStatus(id, isOnline);
    }

    @Get('available/:countryCode')
    @ApiOperation({ summary: 'Get list of available riders by country' })
    getAvailable(@Param('countryCode') countryCode: string) {
        return this.ridersService.getAvailableRiders(countryCode);
    }

    @Patch(':id/location')
    @ApiOperation({ summary: 'Update rider real-time GPS location' })
    updateLocation(
        @Param('id') id: string,
        @Body() location: { latitude: number; longitude: number }
    ) {
        return this.ridersService.updateLocation(id, location);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get rider profile and performance stats' })
    findOne(@Param('id') id: string) {
        return this.ridersService.findOne(id);
    }
}
