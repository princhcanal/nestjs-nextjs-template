const request = global.request;

describe('App Controller', () => {
  it('should respond with Hello World!', () => {
    return request.get('/').expect(200).expect('Hello World!');
  });
});
