import { Controller, Get, Post, Body, Param, UseGuards, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiKeyGuard } from '../auth/api-key.guard';
import { AppMode } from '@prisma/client';

@Controller('api/core/users')
@UseGuards(ApiKeyGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id/switch-mode')
  async switchMode(
    @Param('id') id: string,
    @Body('mode') mode: AppMode,
  ) {
    return this.userService.switchMode(id, mode);
  }

  @Post(':id/become-driver')
  async becomeDriver(
    @Param('id') id: string,
    @Body() driverData: any,
  ) {
    return this.userService.becomeDriver(id, driverData);
  }
}
