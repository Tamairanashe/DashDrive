import { Module } from '@nestjs/common';
import { RealTimeGateway } from './real-time.gateway.js';
import { EventConsumer } from './event-consumer.controller.js';

@Module({
  providers: [RealTimeGateway],
  controllers: [EventConsumer],
  exports: [RealTimeGateway],
})
export class RealTimeModule {}
