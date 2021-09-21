/**
 * @jest-environment ./test-environment
 */

import { AuthenticationController } from '../../src/authentication/authentication.controller';

const request = global.request;

describe('Authentication Controller', () => {
  // TODO: expect auth and refresh token headers to be set
  it('should register user', () => {
    return request
      .post(`${AuthenticationController.AUTH_API_ROUTE}/register`)
      .send({ email: 'test@test.com', username: 'test', password: 'test' })
      .expect(201);
  });

  // // FIXME: logout responds with 401 Unauthorized
  // it('should register user, logout, then log in', async () => {
  //   await request
  //     .post(`${AuthenticationController.AUTH_API_ROUTE}/register`)
  //     .send({ email: 'test@test.com', username: 'test', password: 'test' })
  //     .expect(201);

  //   await request
  //     .post(`${AuthenticationController.AUTH_API_ROUTE}/logout`)
  //     .expect(200);

  //   return request
  //     .post(`${AuthenticationController.AUTH_API_ROUTE}/login`)
  //     .send({ email: 'test@test.com', password: 'test' })
  //     .expect(200);
  // });
});
