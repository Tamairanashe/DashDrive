import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Connect to RabbitMQ for Event-Driven Communication
  /*
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
      queue: 'admin_events_queue',
      queueOptions: {
        durable: true,
      },
    },
  });
  */

  app.setGlobalPrefix('api');
  app.enableCors();
  
  // await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3001);
  console.log(`[Admin Backend] Hybrid App running on port ${process.env.PORT ?? 3001}`);
}
bootstrap();
