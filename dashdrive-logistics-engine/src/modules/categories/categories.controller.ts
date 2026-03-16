import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateCategoryDto } from './dto/create-category.dto';

@ApiTags('categories')
@Controller('categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new menu category' })
  @ApiResponse({ status: 201, description: 'Category successfully created' })
  create(@Req() req: any, @Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(req.user.sub, createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories for the store' })
  @ApiResponse({ status: 200, description: 'Return list of categories' })
  findAll(@Req() req: any, @Query('storeId') storeId?: string) {
    return this.categoriesService.findAll(req.user.sub, storeId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific category' })
  @ApiResponse({ status: 200, description: 'Return category details' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.categoriesService.findOne(id, req.user.sub);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update category name/status' })
  @ApiResponse({ status: 200, description: 'Category successfully updated' })
  update(@Req() req: any, @Param('id') id: string, @Body() body: any) {
    return this.categoriesService.update(id, req.user.sub, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category' })
  @ApiResponse({ status: 200, description: 'Category successfully deleted' })
  remove(@Req() req: any, @Param('id') id: string) {
    return this.categoriesService.remove(id, req.user.sub);
  }
}
