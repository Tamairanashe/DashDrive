import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log('🔄 Starting Dashdrive Mart Backend...');
  const app = await NestFactory.create(AppModule);

  // Security Middleware
  app.use(helmet());
  app.enableCors();

  // Global Prefix
  app.setGlobalPrefix('api/v1');

  // Global Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('Dashdrive Mart API')
    .setDescription('Multi-country Merchant Portal Backend')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(
    `🚀 Dashdrive Mart Backend running on: http://0.0.0.0:${port}/api/v1`,
  );
  console.log(`📚 API Documentation: http://0.0.0.0:${port}/docs`);
}
bootstrap().catch((err) => {
  console.error('💥 Error during bootstrap:', err);
  process.exit(1);
});
