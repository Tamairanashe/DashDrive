import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { PlatformConfigService } from './platform-config.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { AdminRole } from '@prisma/client';

@Controller('platform-config')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PlatformConfigController {
  constructor(private readonly configService: PlatformConfigService) {}

  @Get()
  @Roles(AdminRole.SUPER_ADMIN)
  async getAll() {
    const configs = await this.configService.findAll();
    return {
      success: true,
      data: configs,
    };
  }

  @Post(':key')
  @Roles(AdminRole.SUPER_ADMIN)
  async update(
    @Param('key') key: string,
    @Body() body: { value: any; description?: string },
  ) {
    const config = await this.configService.update(key, body.value, body.description);
    return {
      success: true,
      data: config,
    };
  }
}
