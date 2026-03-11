import { Controller, Get, Post, Body, UseGuards, Param } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ApiKeyGuard } from '../auth/api-key.guard';

@Controller('api/core/documents')
@UseGuards(ApiKeyGuard)
export class DocumentController {
  constructor(private prisma: PrismaService) {}

  @Post('upload')
  async upload(@Body() data: any) {
    return this.prisma.document.create({
      data: {
        owner_id: data.ownerId,
        type: data.type,
        file_url: data.url,
        uploaded_at: new Date(),
      },
    });
  }

  @Get(':id')
  async getDocument(@Param('id') id: string) {
    return this.prisma.document.findUnique({
      where: { id },
    });
  }
}
