import { Controller, Get, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { StoresService } from './stores.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { AdminRole } from '@prisma/client';

@Controller('admin/stores')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StoresController {
  constructor(
    private readonly storesService: StoresService,
    private readonly prisma: PrismaService
  ) {}

  @Get('list')
  async getStores(@Query('status') status?: string) {
    const stores = await this.storesService.findAll(status);
    return stores.map(s => ({
      id: s.id,
      name: s.name,
      address: s.address,
      isActive: s.isActive,
      createdAt: s.createdAt,
      ownerName: (s as any).Merchant?.storeName || 'Unknown',
    }));
  }

  @Get('details/:id')
  async getStoreDetails(@Param('id') id: string) {
    return this.prisma.store.findUnique({
      where: { id },
      include: { Merchant: true }
    });
  }

  @Patch('toggle-status/:id')
  @Roles(AdminRole.SUPER_ADMIN)
  async toggleStatus(
    @Param('id') id: string,
    @Body() body: { is_active: boolean },
  ) {
    const updated = await this.storesService.updateStatus(id, body.is_active);
    return {
       success: true,
       data: updated,
       message: `Store ${body.is_active ? 'Online' : 'Offline'} successfully`
    };
  }
}
