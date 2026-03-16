import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from '@prisma/client';

@ApiTags('orders')
@Controller('orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post(':storeId')
  @ApiOperation({ summary: 'Create a new marketplace order' })
  @ApiResponse({ status: 201, description: 'Order successfully created' })
  createOrder(
    @Req() req: any,
    @Param('storeId') storeId: string,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.ordersService.createOrder(
      req.user.sub,
      storeId,
      createOrderDto,
    );
  }

  @Get('store/:storeId')
  @ApiOperation({ summary: 'Get all orders for a specific store' })
  @ApiResponse({ status: 200, description: 'Return list of orders' })
  getStoreOrders(@Req() req: any, @Param('storeId') storeId: string) {
    return this.ordersService.getStoreOrders(req.user.sub, storeId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific order with full status history' })
  @ApiResponse({ status: 200, description: 'Return order details' })
  getOrder(@Req() req: any, @Param('id') id: string) {
    return this.ordersService.getOrderById(id, req.user.sub);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update order lifecycle status' })
  @ApiResponse({ status: 200, description: 'Status successfully updated' })
  updateStatus(
    @Req() req: any,
    @Param('id') id: string,
    @Body('status') status: OrderStatus,
    @Body('note') note?: string,
  ) {
    return this.ordersService.updateStatus(id, req.user.sub, status, note);
  }
}
