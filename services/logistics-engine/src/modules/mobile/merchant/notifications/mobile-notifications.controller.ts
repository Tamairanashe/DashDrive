import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { MobileNotificationsService } from './mobile-notifications.service';

@ApiTags('mobile/merchant/notifications')
@Controller('mobile/merchant/notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class MobileNotificationsController {
  constructor(
    private readonly notificationsService: MobileNotificationsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List notifications for merchant mobile app' })
  async listNotifications(
    @Request() req: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.notificationsService.listNotifications(
      req.user.sub,
      page,
      limit,
    );
  }

  @Post(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  async markAsRead(@Request() req: any, @Param('id') id: string) {
    return this.notificationsService.markAsRead(id, req.user.sub);
  }
}
