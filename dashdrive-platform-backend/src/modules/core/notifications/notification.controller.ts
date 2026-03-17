import { Controller, Post, Body, Get, Param, UseGuards, Patch } from '@nestjs/common';
import { ApiKeyGuard } from '../auth/api-key.guard';
import { NotificationService } from './notification.service';

@Controller('api/core/notifications')
@UseGuards(ApiKeyGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('send')
  async send(@Body() data: any) {
    return this.notificationService.sendNotification(data);
  }

  @Get('user/:userId')
  async getUserNotifications(@Param('userId') userId: string) {
    return this.notificationService.getUserNotifications(userId);
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string) {
    return this.notificationService.markAsRead(id);
  }
}
