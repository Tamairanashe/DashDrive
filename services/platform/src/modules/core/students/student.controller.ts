import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ApiKeyGuard } from '../auth/api-key.guard';

@Controller('api/core/students')
@UseGuards(ApiKeyGuard)
export class StudentController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getStudents(@Query('parentId') parentId?: string) {
    if (parentId) {
      return this.prisma.student.findMany({
        where: { parent_id: parentId },
        include: { school: true },
      });
    }
    return this.prisma.student.findMany({
      include: { school: true },
    });
  }

  @Post()
  async createStudent(@Body() body: { parent_id: string; name: string; age: number; school_id: string; grade?: string; special_notes?: string }) {
    return this.prisma.student.create({
      data: body,
    });
  }

  @Get(':id')
  async getStudent(@Param('id') id: string) {
    return this.prisma.student.findUnique({
      where: { id },
      include: { school: true, parent: true },
    });
  }
}
