import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:4321',
      'http://localhost:3000',
      'https://backend-rest-api-backend.vercel.app',
      'https://backend-rest-api-web.vercel.app',
      process.env.FRONTEND_URL || '*',
    ],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization,Accept',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api', {
    exclude: ['/'],
  });

  await app.listen(process.env.PORT ?? 3001);
  console.log(
    ` Server running on http://localhost:${process.env.PORT ?? 3001}`,
  );
}
void bootstrap();
