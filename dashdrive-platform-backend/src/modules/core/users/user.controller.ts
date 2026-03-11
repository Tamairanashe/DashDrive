import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ApiKeyGuard } from '../auth/api-key.guard';

@Controller('api/core/users')
@UseGuards(ApiKeyGuard)
export class UserController {
  constructor(private prisma: PrismaService) {}

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        roles: { include: { role: true } },
        borrower: true,
        bnpl_account: true,
      },
    });
  }
}
