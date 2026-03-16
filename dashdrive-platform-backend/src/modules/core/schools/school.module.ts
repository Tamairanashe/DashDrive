import { Module } from '@nestjs/common';
import { SchoolController } from './school.controller';
import { PrismaService } from '../../../prisma/prisma.service';

@Module({
  controllers: [SchoolController],
  providers: [PrismaService],
})
export class SchoolModule {}
