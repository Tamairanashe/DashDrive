import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true, // or specific list e.g. ['http://localhost:3000']
    credentials: true,
  });
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  const config = new DocumentBuilder()
    .setTitle('DashDrive Mobility API')
    .setDescription('The mobility backend for DashRental and Car Hire Partner Portal')
    .setVersion('1.0')
    .addTag('mobility')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3002;
  await app.listen(port);
  console.log(`🚀 Mobility Backend running on: http://localhost:${port}`);
  console.log(`📖 Swagger docs available at: http://localhost:${port}/docs`);
}
bootstrap();
