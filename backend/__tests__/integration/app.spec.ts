const request = global.request;

describe('App Controller', () => {
  describe('GET /', () => {
    it('should respond with Hello World!', () => {
      return request.get('/').expect(200).expect('Hello World!');
    });
  });
});
