import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  Req,
  Body,
} from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

interface WebhookRequestBody {
  url: string;
  events: string[];
}

interface AuthenticatedRequest extends Request {
  user: {
    sub: string;
    email: string;
  };
}

@ApiTags('developer-webhooks')
@Controller('developer/webhooks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post()
  @ApiOperation({ summary: 'Register a new webhook endpoint' })
  createConfig(
    @Req() req: AuthenticatedRequest,
    @Body() body: WebhookRequestBody,
  ) {
    return this.webhooksService.createConfig(req.user.sub, body);
  }

  @Get()
  @ApiOperation({ summary: 'List all registered webhooks' })
  listConfigs(@Req() req: AuthenticatedRequest) {
    return this.webhooksService.listConfigs(req.user.sub);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a webhook endpoint' })
  deleteConfig(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.webhooksService.deleteConfig(req.user.sub, id);
  }
}
