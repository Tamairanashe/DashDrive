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
import { DeveloperService } from './developer.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('developer')
@Controller('developer')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DeveloperController {
  constructor(private readonly developerService: DeveloperService) {}

  @Post('api-keys')
  @ApiOperation({ summary: 'Generate a new API key' })
  generateKey(@Req() req: any, @Body() body: { name: string }) {
    return this.developerService.generateKey(req.user.sub, body.name);
  }

  @Get('api-keys')
  @ApiOperation({ summary: 'List all active API keys' })
  listKeys(@Req() req: any) {
    return this.developerService.listKeys(req.user.sub);
  }

  @Delete('api-keys/:id')
  @ApiOperation({ summary: 'Revoke an API key' })
  revokeKey(@Req() req: any, @Param('id') id: string) {
    return this.developerService.revokeKey(req.user.sub, id);
  }
}
