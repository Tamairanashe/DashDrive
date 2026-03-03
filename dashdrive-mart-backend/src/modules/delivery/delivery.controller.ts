import { Controller, Post, Body, Patch, Param, Get, UseGuards, Query } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { DeliveryStatus } from '@prisma/client';

@ApiTags('delivery')
@Controller('delivery')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class DeliveryController {
    constructor(private readonly deliveryService: DeliveryService) { }

    @Post(':orderId')
    @ApiOperation({ summary: 'Initialize delivery for an order' })
    createDelivery(@Param('orderId') orderId: string) {
        return this.deliveryService.createDelivery(orderId);
    }

    @Post(':orderId/auto-assign')
    @ApiOperation({ summary: 'Auto-assign rider by country' })
    autoAssign(@Param('orderId') orderId: string, @Query('countryCode') countryCode: string) {
        return this.deliveryService.autoAssignRider(orderId, countryCode);
    }

    @Patch(':orderId/assign/:riderId')
    @ApiOperation({ summary: 'Manually assign a rider to a delivery' })
    assignRider(
        @Param('orderId') orderId: string,
        @Param('riderId') riderId: string,
    ) {
        return this.deliveryService.assignRider(orderId, riderId);
    }

    @Patch(':orderId/status')
    @ApiOperation({ summary: 'Update delivery and order lifecycle status' })
    updateStatus(
        @Param('orderId') orderId: string,
        @Body('status') status: DeliveryStatus,
    ) {
        return this.deliveryService.updateStatus(orderId, status);
    }

    @Get(':orderId')
    @ApiOperation({ summary: 'Get delivery details for an order' })
    getDelivery(@Param('orderId') orderId: string) {
        return this.deliveryService.getDeliveryByOrder(orderId);
    }
}
