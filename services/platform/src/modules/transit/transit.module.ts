import { Module } from '@nestjs/common';
import { TransitService } from './transit.service';
import { TransitController } from './transit.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TransitController],
  providers: [TransitService],
  exports: [TransitService],
})
export class TransitModule {}
