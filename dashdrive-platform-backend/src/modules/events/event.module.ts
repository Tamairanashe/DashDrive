import { Module } from '@nestjs/common';
import { EventBookingService } from './event.service';
import { EventBookingController } from './event.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EventBookingController],
  providers: [EventBookingService],
  exports: [EventBookingService],
})
export class EventBookingModule {}
