import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Req } from '@nestjs/common';
import { ProductsService } from './products.service';
import { InventoryService } from './inventory.service';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateProductDto } from './dto/create-product.dto';

@ApiTags('products')
@Controller('products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService,
        private readonly inventoryService: InventoryService
    ) { }

    @Post()
    @ApiOperation({ summary: 'Create a new product with variants and modifiers' })
    @ApiResponse({ status: 201, description: 'Product successfully created' })
    create(@Req() req: any, @Body() createProductDto: any) {
        return this.productsService.create(req.user.sub, createProductDto);
    }

    @Post('bulk/:storeId')
    @ApiOperation({ summary: 'Bulk import products for a specific store' })
    @ApiResponse({ status: 201, description: 'Products successfully imported' })
    bulkCreate(
        @Req() req: any,
        @Param('storeId') storeId: string,
        @Body() products: any[]
    ) {
        return this.productsService.bulkCreate(req.user.sub, storeId, products);
    }

    @Get()
    @ApiOperation({ summary: 'Get all products, optionally filtered by store' })
    @ApiResponse({ status: 200, description: 'Return list of products' })
    findAll(@Req() req: any, @Query('storeId') storeId?: string) {
        return this.productsService.findAll(req.user.sub, storeId);
    }

    @Get('low-stock')
    @ApiOperation({ summary: 'Get products with stock below threshold' })
    @ApiResponse({ status: 200, description: 'Return list of low-stock items' })
    getLowStock(@Req() req: any) {
        return this.productsService.getLowStockItems(req.user.sub);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a specific product with variants and modifiers' })
    @ApiResponse({ status: 200, description: 'Return product details' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    findOne(@Req() req: any, @Param('id') id: string) {
        return this.productsService.findOne(id, req.user.sub);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update product details' })
    @ApiResponse({ status: 200, description: 'Product successfully updated' })
    update(@Req() req: any, @Param('id') id: string, @Body() body: any) {
        return this.productsService.update(id, req.user.sub, body);
    }

    @Patch('inventory/adjust')
    @ApiOperation({ summary: 'Adjust stock for a specific product or variant' })
    @ApiResponse({ status: 200, description: 'Stock successfully adjusted' })
    adjustStock(@Req() req: any, @Body() data: any) {
        return this.inventoryService.adjustStock(req.user.sub, data);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Soft-delete a product' })
    @ApiResponse({ status: 200, description: 'Product successfully deactivated' })
    remove(@Req() req: any, @Param('id') id: string) {
        return this.productsService.remove(id, req.user.sub);
    }
}
