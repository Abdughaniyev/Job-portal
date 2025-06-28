import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AllExceptionFlter } from './lib/AllExceptionFilter';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from './common/config/config';
import { join } from 'path';
import helmet from 'helmet';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Allow all origins in production, only localhost in dev
  app.enableCors({
    origin:
      process.env.NODE_ENV === 'production'
        ? ['https://job-portal-production-9e00.up.railway.app']
        : 'http://localhost:3001',
    credentials: true,
  });

  app.useBodyParser('json');
  app.use(helmet());
  // Global prefix for all routes (e.g., /api/v1/users)
  app.setGlobalPrefix('api/v1');

  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionFlter(httpAdapterHost));

  // File uploads folder
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Auto-validate DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  //   Swagger setup
  const options = new DocumentBuilder()
    .setTitle('Job Portal API')
    .setDescription('API docs for the Job Portal')
    .setVersion('1.0.0')
    .addServer('/', 'Production') // Always works in deployed environments
    .addServer(`http://localhost:${config.port}`, 'Local') // Optional: visible in Swagger locally
    .addTag('APIs')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

  // Use PORT from env (Render/Railway provide it)
  const PORT = process.env.PORT || config.port || 3000;

  await app.listen(PORT, () => {
    console.log(`🚀 App running on port ${PORT}`);
    console.log(`📚 Swagger docs at /api-docs`);

  });
}

bootstrap();
