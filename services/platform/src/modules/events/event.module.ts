import { Module } from '@nestjs/common';
import { EventBookingService } from './event.service';
import { EventBookingController } from './event.controller';
import { PrismaModule } from '../../prisma/prisma.module';

import { ConfigModule } from '@nestjs/config';
import { SeatLockService } from './seat-lock.service';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [EventBookingController],
  providers: [EventBookingService, SeatLockService],
  exports: [EventBookingService, SeatLockService],
})
export class EventBookingModule {}
