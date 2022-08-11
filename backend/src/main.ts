import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import {
  DocumentBuilder,
  SwaggerModule,
  SwaggerDocumentOptions,
} from '@nestjs/swagger';

// FIXME: cookies not setting in production
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const baseClientUrl = process.env.BASE_CLIENT_URL;
  const branch = process.env.HEROKU_BRANCH;

  if (baseClientUrl) {
    app.enableCors({ origin: baseClientUrl, credentials: true });
  } else if (branch) {
    app.enableCors({
      origin: (origin, callback) => {
        callback(undefined, origin);
      },
      credentials: true,
    });
  }

  app.useGlobalPipes(new ValidationPipe());
  // TODO: use global auth guard
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.use(cookieParser());
  app.use(helmet());

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

  await app.listen(process.env.PORT || 5001);
}
bootstrap();
