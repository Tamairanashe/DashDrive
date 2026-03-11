import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from '../auth/api-key.guard';

@Controller('api/core/notifications')
@UseGuards(ApiKeyGuard)
export class NotificationController {
  @Post('send')
  async send(@Body() data: any) {
    console.log(`[Notification] Sending ${data.type} to user ${data.userId}: ${data.message}`);
    return { status: 'sent', timestamp: new Date() };
  }
}
