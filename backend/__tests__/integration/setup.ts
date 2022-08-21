import { SuperTest, Test, CallbackHandler } from 'supertest';

export const request: SuperTest<Test> = global.request;

type Methods = 'post' | 'get' | 'put' | 'delete';

const hook =
  (method: Methods, isAdmin?: boolean) =>
  (url: string, callback?: CallbackHandler): Test => {
    const accessToken = isAdmin
      ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyY2YzODY3MC0wYThhLTQxZTktOTAxOC1lOGI4YTliMzY0ODYiLCJpYXQiOjE2NjEwNDg0MjIsImV4cCI6MzE3MjA1NDkwODIyfQ.7NCz6kII-5qYeTW_eEnW-gtKOnMRCdgePzb9sZ_hlLg'
      : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyZjU0Y2EwYi1lMzg5LTRlMTctYTk3OC0wY2I5OGUwZjdhNDYiLCJpYXQiOjE2NjEwNDgzNTcsImV4cCI6MzE3MjA1NDkwNzU3fQ.POlRWQVPd24FDf14kLJ4u92nKRoBa-79-pxOoSZ-QAw';

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
