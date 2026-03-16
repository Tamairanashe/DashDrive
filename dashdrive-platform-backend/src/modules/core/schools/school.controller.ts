import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ApiKeyGuard } from '../auth/api-key.guard';

@Controller('api/core/schools')
@UseGuards(ApiKeyGuard)
export class SchoolController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getSchools() {
    return this.prisma.school.findMany();
  }

  @Post()
  async createSchool(@Body() body: { name: string; address: string; latitude: number; longitude: number; phone?: string }) {
    return this.prisma.school.create({
      data: body,
    });
  }

  @Get(':id')
  async getSchool(@Param('id') id: string) {
    return this.prisma.school.findUnique({
      where: { id },
    });
  }
}
