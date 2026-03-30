import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { PlatformEvent } from '../src/common/events/platform-events.js';
import { AppModule } from '../src/app.module.js';

async function testEventBus() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
      queue: 'test_queue',
    },
  });

  // This is a dummy script. In reality, you'd use a ClientProxy to emit.
  console.log('Test logic: Use EventBusService.publish() in an actual service to trigger the flow.');
}
