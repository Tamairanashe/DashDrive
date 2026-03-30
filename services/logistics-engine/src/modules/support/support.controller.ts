import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SupportService } from './support.service';
import { TicketStatus } from '@prisma/client';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('support')
@Controller('support')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post('tickets')
  @ApiOperation({ summary: 'Create a new support ticket' })
  create(@Body() data: any) {
    return this.supportService.createTicket(data);
  }

  @Get('tickets')
  @ApiOperation({ summary: 'List all support tickets' })
  findAll(@Query('status') status?: TicketStatus) {
    return this.supportService.getTickets(status);
  }

  @Get('tickets/:id')
  @ApiOperation({ summary: 'Get ticket details' })
  findOne(@Param('id') id: string) {
    return this.supportService.getTicketDetails(id);
  }

  @Patch('tickets/:id/status')
  @ApiOperation({ summary: 'Update ticket status' })
  updateStatus(@Param('id') id: string, @Body('status') status: TicketStatus) {
    return this.supportService.updateTicketStatus(id, status);
  }
}
