import { Controller, Post, Body, Patch, Param, Get, UseGuards } from '@nestjs/common';
import { RidersService } from './riders.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('riders')
@Controller('riders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class RidersController {
    constructor(private readonly ridersService: RidersService) { }

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
}
