import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CmsService, CreateBannerDto, CreateContentBlockDto } from './cms.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('cms')
@Controller('cms')
export class CmsController {
    constructor(private readonly cmsService: CmsService) { }

    @Get('home-feed/:vertical')
    @ApiOperation({ summary: 'Public endpoint to fetch all active CMS components for a vertical' })
    getHomeFeed(@Param('vertical') vertical: string) {
        return this.cmsService.getHomeFeed(vertical.toUpperCase());
    }

    // --- Banners Admin ---
    @Post('banners')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'superadmin')
    createBanner(@Body() data: CreateBannerDto) {
        return this.cmsService.createBanner(data);
    }

    @Get('banners')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'superadmin')
    getAllBanners() {
        return this.cmsService.getBanners();
    }

    @Put('banners/:id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'superadmin')
    updateBanner(@Param('id') id: string, @Body() data: Partial<CreateBannerDto>) {
        return this.cmsService.updateBanner(id, data);
    }

    @Delete('banners/:id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'superadmin')
    deleteBanner(@Param('id') id: string) {
        return this.cmsService.deleteBanner(id);
    }

    // --- Content Blocks Admin ---
    @Post('blocks')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'superadmin')
    createBlock(@Body() data: CreateContentBlockDto) {
        return this.cmsService.createContentBlock(data);
    }

    @Get('blocks')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'superadmin')
    getAllBlocks() {
        return this.cmsService.getContentBlocks();
    }

    @Put('blocks/:id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'superadmin')
    updateBlock(@Param('id') id: string, @Body() data: Partial<CreateContentBlockDto>) {
        return this.cmsService.updateContentBlock(id, data);
    }

    @Delete('blocks/:id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'superadmin')
    deleteBlock(@Param('id') id: string) {
        return this.cmsService.deleteContentBlock(id);
    }
}
