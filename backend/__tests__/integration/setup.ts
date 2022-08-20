import { SuperTest, Test, CallbackHandler } from 'supertest';

export const request: SuperTest<Test> = global.request;

type Methods = 'post' | 'get' | 'put' | 'delete';

const hook =
  (method: Methods, isAdmin?: boolean) =>
  (url: string, callback?: CallbackHandler): Test => {
    const accessToken = isAdmin
      ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyY2YzODY3MC0wYThhLTQxZTktOTAxOC1lOGI4YTliMzY0ODYiLCJpYXQiOjE2NjA5ODI4MzQsImV4cCI6MTY2MTA2OTIzNH0.i7DMMpaHmIye-oDqjLFb6zaFNNrIY2NJ2nC3ucRVt-k'
      : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyZjU0Y2EwYi1lMzg5LTRlMTctYTk3OC0wY2I5OGUwZjdhNDYiLCJpYXQiOjE2NjA5NjA5NzcsImV4cCI6MTY2MTA0NzM3N30.uHfDdAFQetZoViVNv5BsxsygVD4WgAI8ClOZBWBJ7tw';

    return request[method](url, callback).set(
      'Authorization',
      `Bearer ${accessToken}`
    );
  };

export const requestWithUser = {
  post: hook('post'),
  get: hook('get'),
  put: hook('put'),
  delete: hook('delete'),
};

export const requestWithAdmin = {
  post: hook('post', true),
  get: hook('get', true),
  put: hook('put', true),
  delete: hook('delete', true),
};
