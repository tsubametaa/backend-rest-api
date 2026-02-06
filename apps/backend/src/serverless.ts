import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Request, Response } from 'express';

let app: NestExpressApplication;
const server = express();

async function createNestServer(expressInstance: express.Express) {
  const adapter = new ExpressAdapter(expressInstance);
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    adapter,
    { logger: ['error', 'warn', 'log'] },
  );

  app.enableCors({
    origin: [
      'http://localhost:4321',
      'http://localhost:3000',
      process.env.FRONTEND_URL || '*',
    ],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');

  await app.init();
  return app;
}

const appPromise = createNestServer(server);

export default async function handler(req: Request, res: Response) {
  await appPromise;
  server(req, res);
}
