import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { Test, SuperTest } from 'supertest';
import * as helmet from 'helmet';
import {
  DocumentBuilder,
  SwaggerModule,
  SwaggerDocumentOptions,
} from '@nestjs/swagger';
// import * as csurf from 'csurf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const origin = process.env.BASE_CLIENT_URL;

  if (origin) {
    app.enableCors({ origin, credentials: true });
  }

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.use(cookieParser());
  app.use(helmet());
  // app.use(csurf({ cookie: true }));

  app.setGlobalPrefix('/api/v1');

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (_controllerKey: string, methodKey: string) =>
      methodKey,
  };

  const config = new DocumentBuilder()
    .setTitle('NestJS/NextJS Template')
    .setDescription('API for NestJS/NextJS Template')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, document);

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
