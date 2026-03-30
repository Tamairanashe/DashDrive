import { Controller, Get, Post, Body, Param, Query, Put, Delete, UseGuards, Patch } from '@nestjs/common';
import { MarketplaceService } from '../marketplace/marketplace.service';
import { FirebaseAuthGuard } from '../core/auth/firebase-auth.guard';

@Controller() // Base paths like /merchants, /orders, /products
@UseGuards(FirebaseAuthGuard)
export class MerchantController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  // --- Merchant Profile ---
  @Get('merchants/profile')
  getProfile(@Body('user') user: any) {
    return this.marketplaceService.getStoreByMerchant(user.uid);
  }

  @Post('merchants/store/onboard')
  onboard(@Body() data: any) {
    return this.marketplaceService.createStore(data);
  }

  // --- Orders ---
  @Get('orders/store/:storeId')
  getStoreOrders(@Param('storeId') storeId: string) {
    return this.marketplaceService.getStoreOrders(storeId);
  }

  @Patch('orders/:id/status')
  updateOrderStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.marketplaceService.updateOrderStatus(id, status);
  }

  // --- Products ---
  @Get('products')
  getProducts(@Query('storeId') storeId: string) {
    return this.marketplaceService.getStoreProducts(storeId);
  }

  @Post('products')
  createProduct(@Body() data: any) {
    return this.marketplaceService.createProduct(data);
  }

  @Patch('products/:id')
  updateProduct(@Param('id') id: string, @Body() data: any) {
    return this.marketplaceService.updateProduct(id, data);
  }

  @Delete('products/:id')
  deleteProduct(@Param('id') id: string) {
    return this.marketplaceService.deleteProduct(id);
  }
}
