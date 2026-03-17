import { Module } from '@nestjs/common';
import { RealTimeGateway } from './real-time.gateway';
import { EventConsumer } from './event-consumer.controller';

@Module({
  providers: [RealTimeGateway],
  controllers: [EventConsumer],
  exports: [RealTimeGateway],
})
export class RealTimeModule {}
