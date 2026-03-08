import { Controller, Get, Post, Body, Param, UseGuards, Delete } from '@nestjs/common';
import { EnterpriseService, CreateEnterpriseDto, AssignMerchantDto } from './enterprise.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('enterprise')
@Controller('enterprise')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class EnterpriseController {
    constructor(private readonly enterpriseService: EnterpriseService) { }

    @Post()
    @Roles('admin', 'superadmin')
    @ApiOperation({ summary: 'Create a new Enterprise (Holding Company)' })
    create(@Body() data: CreateEnterpriseDto) {
        return this.enterpriseService.createEnterprise(data);
    }

    @Get()
    @Roles('admin', 'superadmin', 'enterprise_admin')
    @ApiOperation({ summary: 'Get all enterprises' })
    findAll() {
        return this.enterpriseService.getEnterprises();
    }

    @Get(':id')
    @Roles('admin', 'superadmin', 'enterprise_admin')
    @ApiOperation({ summary: 'Get an enterprise by ID' })
    findOne(@Param('id') id: string) {
        return this.enterpriseService.getEnterpriseById(id);
    }

    @Post(':id/merchants')
    @Roles('admin', 'superadmin')
    @ApiOperation({ summary: 'Assign a merchant to an enterprise' })
    assignMerchant(@Param('id') id: string, @Body() data: AssignMerchantDto) {
        return this.enterpriseService.assignMerchant(id, data);
    }

    @Delete(':id/merchants/:merchantId')
    @Roles('admin', 'superadmin')
    @ApiOperation({ summary: 'Remove a merchant from an enterprise' })
    removeMerchant(@Param('id') id: string, @Param('merchantId') merchantId: string) {
        return this.enterpriseService.removeMerchant(id, merchantId);
    }
}
