import { Controller, Get, Patch, Param, Body, Post, UseGuards } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { AdminRole } from '@prisma/client';

@Controller('admin/alerts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  async getAlerts() {
    return this.alertsService.findAll();
  }

  @Get(':id')
  async getAlert(@Param('id') id: string) {
    return this.alertsService.findOne(id);
  }

  @Patch(':id/decision')
  @Roles(AdminRole.SUPER_ADMIN)
  async updateDecision(
    @Param('id') id: string,
    @Body('decision') decision: 'APPROVED' | 'REVIEW' | 'BLOCKED',
  ) {
    return this.alertsService.updateDecision(id, decision);
  }

  @Post(':id/dismiss')
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.SUPPORT_AGENT)
  async dismissAlert(@Param('id') id: string) {
    return this.alertsService.dismissAlert(id);
  }
}
