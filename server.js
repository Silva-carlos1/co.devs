import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import express from 'express';
import { AppModule } from './dist/app.module.js';

const server = express();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.init();
  return server;
}

export default async function handler(req, res) {
  try {
    const serverInstance = await bootstrap();
    serverInstance(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
}
