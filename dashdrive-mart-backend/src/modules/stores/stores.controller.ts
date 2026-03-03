import { Controller, Get, Post, Body, UseGuards, Param, Req } from '@nestjs/common';
import { StoresService } from './stores.service';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateStoreDto } from './dto/create-store.dto';

@ApiTags('stores')
@Controller('stores')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class StoresController {
    constructor(private readonly storesService: StoresService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new store for the merchant' })
    @ApiResponse({ status: 201, description: 'Store successfully created' })
    create(@Req() req: any, @Body() createStoreDto: CreateStoreDto) {
        return this.storesService.create(req.user.sub, createStoreDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all stores for the current merchant' })
    @ApiResponse({ status: 200, description: 'Return list of stores' })
    findAll(@Req() req: any) {
        return this.storesService.findAll(req.user.sub);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a specific store' })
    @ApiResponse({ status: 200, description: 'Return store details' })
    @ApiResponse({ status: 404, description: 'Store not found' })
    findOne(@Req() req: any, @Param('id') id: string) {
        return this.storesService.findOne(id, req.user.sub);
    }
}
