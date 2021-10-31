import { HttpStatus } from '@nestjs/common';
import { SuperTest, Test } from 'supertest';
import { createApp } from './utils/create-app';

describe('AppController', () => {
  let request: SuperTest<Test>;

  beforeAll(async () => {
    const { req } = await createApp();
    request = req;
  });

  describe('getHello', () => {
    it('should return "Hello World!"', () => {
      return request.get('/').expect(HttpStatus.OK).expect('Hello World!');
    });
  });
});
