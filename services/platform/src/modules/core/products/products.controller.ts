import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getProducts(@Query('category') category?: 'finance' | 'insurance') {
    if (category) {
      return this.productsService.findByCategory(category);
    }
    return this.productsService.findAll();
  }

  @Post()
  createProduct(@Body() body: any) {
    return this.productsService.create(body);
  }
}
