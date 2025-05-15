import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AllExceptionFlter } from './lib/AllExceptionFilter';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from './common/config/config';
 
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  app.useBodyParser('json')
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionFlter(httpAdapterHost));
  app.setGlobalPrefix('api/v1');


  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true
    }),
  )

  const options = new DocumentBuilder()
    .setTitle('Product_Typeorm')
    .setDescription('Description')
    .setVersion('1.0.0')
    .addServer(`http://localhost:${config.port}`, 'Local environment')
    .addTag('apies')
    .addBearerAuth()
    .build()


  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('docs', app, document)
  await app.listen(config.port, () => {
    console.log(`http://localhost:${config.port}`)
    console.log(`http://localhost:${config.port}/docs`)
  });
}
bootstrap();



// 1. Reset password
// 2. Cookie + refresh token. Refresh token should be saved in the cookie
// 3. 