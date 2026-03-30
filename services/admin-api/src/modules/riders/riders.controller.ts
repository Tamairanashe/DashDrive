import { Controller, Get, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { RidersService } from './riders.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { AdminRole } from '@prisma/client';

@Controller('admin/riders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RidersController {
  constructor(private readonly ridersService: RidersService) {}

  @Get()
  async getRiders(@Query('status') status?: string) {
    return this.ridersService.findAll(status);
  }

  @Get(':id')
  async getRider(@Param('id') id: string) {
    return this.ridersService.findOne(id);
  }

  @Patch('toggle-status/:id')
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.FLEET_MANAGER)
  async toggleStatus(
    @Param('id') id: string,
    @Body('is_active') isActive: boolean,
  ) {
    return this.ridersService.updateStatus(id, isActive);
  }
}
