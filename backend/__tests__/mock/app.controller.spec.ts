import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppController } from '../../src/app.controller';
import { AppService } from '../../src/app.service';

describe('AppController', () => {
  let app: INestApplication;
  let req: request.SuperTest<request.Test>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    req = request(app.getHttpServer());
  });

  describe('getHello', () => {
    it('should return "Hello World!"', () => {
      return req.get('/').expect(200).expect('Hello World!');
    });
  });
});
