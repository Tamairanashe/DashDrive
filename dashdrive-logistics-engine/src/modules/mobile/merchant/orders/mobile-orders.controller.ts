import { Controller, Get, Post, Body, Param, Query, UseGuards, Request, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { OrdersService } from '../../../orders/orders.service';
import { OrderStatus } from '@prisma/client';

@ApiTags('mobile/merchant/orders')
@Controller('mobile/merchant/orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class MobileOrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Get()
    @ApiOperation({ summary: 'List orders for merchant mobile app' })
    @ApiQuery({ name: 'status', required: false, enum: OrderStatus })
    @ApiQuery({ name: 'storeId', required: false })
    async listOrders(
        @Request() req: any,
        @Query('status') status?: OrderStatus,
        @Query('storeId') storeId?: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 20,
    ) {
        const merchantId = req.user.sub;
        // In a real app, you'd add pagination and filtering to the service
        const orders = await this.ordersService.getStoreOrders(merchantId, storeId || '');

        // Filter by status if provided
        const filtered = status ? orders.filter(o => o.status === status) : orders;

        return {
            orders: filtered.map(o => ({
                id: o.id,
                orderNumber: o.orderNumber,
                items: o.items.length,
                total: o.totalAmount,
                status: o.status,
                createdAt: o.createdAt,
            })),
            meta: {
                total: filtered.length,
                page,
                limit
            }
        };
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get order details for merchant mobile app' })
    async getOrder(@Request() req: any, @Param('id') id: string) {
        const merchantId = req.user.sub;
        const order = await this.ordersService.getOrderById(id, merchantId);

        return {
            id: order.id,
            orderNumber: order.orderNumber,
            items: order.items.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.unitPrice,
            })),
            customer: {
                name: order.customerName,
                phone: order.customerPhone,
            },
            deliveryAddress: order.deliveryAddress,
            status: order.status,
            totalAmount: order.totalAmount,
            createdAt: order.createdAt,
        };
    }

    @Post(':id/accept')
    @ApiOperation({ summary: 'Accept an order' })
    async acceptOrder(@Request() req: any, @Param('id') id: string) {
        return this.ordersService.updateStatus(id, req.user.sub, OrderStatus.CONFIRMED, 'Order accepted via mobile');
    }

    @Post(':id/reject')
    @ApiOperation({ summary: 'Reject an order' })
    async rejectOrder(@Request() req: any, @Param('id') id: string) {
        return this.ordersService.updateStatus(id, req.user.sub, OrderStatus.CANCELLED, 'Order rejected via mobile');
    }

    @Post(':id/status')
    @ApiOperation({ summary: 'Update order status' })
    async updateStatus(@Request() req: any, @Param('id') id: string, @Body() body: { status: OrderStatus }) {
        return this.ordersService.updateStatus(id, req.user.sub, body.status, `Updated to ${body.status} via mobile`);
    }
}
