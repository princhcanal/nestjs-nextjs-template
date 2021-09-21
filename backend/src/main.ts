import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { Test, SuperTest } from 'supertest';

async function bootstrap() {
  const origin = process.env.ORIGIN || 'http://localhost:3000';
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin, credentials: true });

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.use(cookieParser());

  app.setGlobalPrefix('/api/v1');

  await app.listen(process.env.PORT || 5000);
}
bootstrap();

declare global {
  namespace NodeJS {
    interface Global {
      // used to add type in tests
      request: SuperTest<Test>;
    }
  }
}
