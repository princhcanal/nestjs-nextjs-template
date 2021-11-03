import {
  /* ClassSerializerInterceptor, */ ValidationPipe,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as cookieParser from 'cookie-parser';
import { MockAppModule } from '../modules/app.mock.module';
import * as request from 'supertest';
// import { Reflector } from '@nestjs/core';
import * as helmet from 'helmet';

export const createApp = async () => {
  const module = await Test.createTestingModule({
    imports: [MockAppModule],
  }).compile();

  const app = module.createNestApplication();

  app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.use(cookieParser());
  app.use(helmet());

  await app.init();

  const req = request(app.getHttpServer());

  return {
    app,
    module,
    req,
  };
};
