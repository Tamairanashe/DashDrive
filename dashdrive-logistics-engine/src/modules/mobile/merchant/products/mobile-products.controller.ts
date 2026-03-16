import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { ProductsService } from '../../../products/products.service';

@ApiTags('mobile/merchant/products')
@Controller('mobile/merchant/products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class MobileProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'List products for merchant mobile app' })
  @ApiQuery({ name: 'storeId', required: false })
  async listProducts(@Request() req: any, @Query('storeId') storeId?: string) {
    const merchantId = req.user.sub;
    const products = await this.productsService.findAll(merchantId, storeId);

    return products.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.basePrice,
      stock: p.stock,
      lowStockThreshold: p.lowStockThreshold,
      category: p.category?.name,
      isActive: p.isActive,
      image: p.images?.[0] || null,
    }));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product details for merchant mobile app' })
  async getProduct(@Request() req: any, @Param('id') id: string) {
    const merchantId = req.user.sub;
    const p = await this.productsService.findOne(id, merchantId);

    return {
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.basePrice,
      stock: p.stock,
      lowStockThreshold: p.lowStockThreshold,
      categoryId: p.categoryId,
      isActive: p.isActive,
      images: p.images,
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  async createProduct(@Request() req: any, @Body() body: any) {
    return this.productsService.create(req.user.sub, body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update product details' })
  async updateProduct(
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.productsService.update(id, req.user.sub, body);
  }

  @Post(':id/stock')
  @ApiOperation({ summary: 'Update product stock' })
  async updateStock(
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: { stock: number },
  ) {
    const merchantId = req.user.sub;
    // Reusing update logic for stock specifically
    return this.productsService.update(id, merchantId, { stock: body.stock });
  }

  @Post(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate a product' })
  async deactivate(@Request() req: any, @Param('id') id: string) {
    return this.productsService.update(id, req.user.sub, { isActive: false });
  }
}
