import { ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as cookieParser from 'cookie-parser';
import { MockAppModule } from '../modules/app.mock.module';
import * as request from 'supertest';

export const createApp = async () => {
  const module = await Test.createTestingModule({
    imports: [MockAppModule],
  }).compile();

  const app = module.createNestApplication();
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  await app.init();

  const req = request(app.getHttpServer());

  return {
    app,
    module,
    req,
  };
};
