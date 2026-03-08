import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { OperationsService } from './operations.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { AdminRole } from '@prisma/client';

@Controller('admin/operations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OperationsController {
  constructor(private readonly operationsService: OperationsService) {}

  @Get('live-orders')
  async getLiveOrders() {
    return this.operationsService.getLiveOrders();
  }

  @Patch('reassign/:orderId')
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.FLEET_MANAGER)
  async reassignRider(
    @Param('orderId') orderId: string,
    @Body('riderId') riderId: string,
  ) {
    return this.operationsService.reassignRider(orderId, riderId);
  }

  @Patch('cancel/:orderId')
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.SUPPORT_AGENT)
  async cancelOrder(
    @Param('orderId') orderId: string,
    @Body('reason') reason: string,
  ) {
    return this.operationsService.cancelOrder(orderId, reason);
  }
}
