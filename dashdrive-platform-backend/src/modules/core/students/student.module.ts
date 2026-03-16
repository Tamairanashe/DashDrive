import { Module } from '@nestjs/common';
import { StudentController } from './student.controller';
import { PrismaService } from '../../../prisma/prisma.service';

@Module({
  controllers: [StudentController],
  providers: [PrismaService],
})
export class StudentModule {}
