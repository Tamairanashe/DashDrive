import { Controller, Get, Post, Delete, Param, UseGuards, Req, Body } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('developer-webhooks')
@Controller('developer/webhooks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WebhooksController {
    constructor(private readonly webhooksService: WebhooksService) { }

    @Post()
    @ApiOperation({ summary: 'Register a new webhook endpoint' })
    createConfig(@Req() req: any, @Body() body: { url: string; events: string[] }) {
        return this.webhooksService.createConfig(req.user.sub, body);
    }

    @Get()
    @ApiOperation({ summary: 'List all registered webhooks' })
    listConfigs(@Req() req: any) {
        return this.webhooksService.listConfigs(req.user.sub);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Remove a webhook endpoint' })
    deleteConfig(@Req() req: any, @Param('id') id: string) {
        return this.webhooksService.deleteConfig(req.user.sub, id);
    }
}
