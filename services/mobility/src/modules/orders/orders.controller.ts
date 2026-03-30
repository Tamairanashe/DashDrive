import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ServiceType } from '@prisma/client';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  async createOrder(@Body() body: {
    userId: string;
    type: ServiceType;
    totalPrice: number;
    address: string;
    items: any[];
    restaurantId?: string;
  }) {
    return this.ordersService.createOrder(body.userId, {
      type: body.type,
      total_price: body.totalPrice,
      address: body.address,
      items: body.items,
      restaurant_id: body.restaurantId,
    });
  }

  @Get(':id')
  async getOrder(@Param('id') id: string) {
    return this.ordersService.getOrder(id);
  }
}
