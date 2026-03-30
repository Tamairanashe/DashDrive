// src/modules/exports/realtime/exports-realtime.module.ts

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ExportsGateway } from './exports.gateway';
import { ExportsEventsService } from './exports-events.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'fallback-secret-for-dev',
    }),
  ],
  providers: [ExportsGateway, ExportsEventsService],
  exports: [ExportsGateway, ExportsEventsService],
})
export class ExportsRealtimeModule {}
