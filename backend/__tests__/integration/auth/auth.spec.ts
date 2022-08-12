import { HttpStatus } from '@nestjs/common';
import { AuthenticationController } from '../../../src/authentication/authentication.controller';
import { LoginUserDTO } from '../../../src/authentication/dto/login-user.dto';
import { RegisterUserDTO } from '../../../src/authentication/dto/register-user.dto';
import { TokensDTO } from '../../../src/authentication/dto/tokens.dto';
import { registerUser } from '../fixtures/user.fixtures';
import { request } from '../setup';

describe('auth.spec.ts - Authentication Controller', () => {
  let loginRoute: string;
  let registerRoute: string;
  let logoutRoute: string;
  let refreshRoute: string;
  const registerUserDTO: RegisterUserDTO = {
    username: 'test_user',
    email: 'testk@test.com',
    password: 'test',
  };

  beforeAll(() => {
    const authRoute = AuthenticationController.AUTH_API_ROUTE;
    loginRoute = authRoute + AuthenticationController.LOGIN_API_ROUTE;
    registerRoute = authRoute + AuthenticationController.REGISTER_API_ROUTE;
    logoutRoute = authRoute + AuthenticationController.LOGOUT_API_ROUTE;
    refreshRoute = authRoute + AuthenticationController.REFRESH_API_ROUTE;
  });

  describe('POST /login', () => {
    it('should throw bad request exception when data is invalid', async () => {
      const loginUserDTOWithoutEmail = {
        password: 'mock',
      };
      const loginUserDTOWithoutPassword = {
        email: 'mock@mock.com',
      };
      const loginUserDTOWithInvalidEmail: LoginUserDTO = {
        email: 'not an email',
        password: 'mock',
      };

      await request.post(loginRoute).expect(HttpStatus.BAD_REQUEST);
      await request
        .post(loginRoute)
        .send(loginUserDTOWithoutEmail)
        .expect(HttpStatus.BAD_REQUEST);
      await request
        .post(loginRoute)
        .send(loginUserDTOWithoutPassword)
        .expect(HttpStatus.BAD_REQUEST);
      await request
        .post(loginRoute)
        .send(loginUserDTOWithInvalidEmail)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('POST /register', () => {
    it('should successfully register when username, email, and password are provided', async () => {
      await registerUser(registerUserDTO);
    });

    it('should throw bad request exception when data is invalid', async () => {
      const registerUserDTOWithoutUsername = {
        email: 'mock@mock.com',
        password: ' mock',
      };
      const registerUserDTOWithoutEmail = {
        username: 'mock',
        password: 'mock',
      };
      const registerUserDTOWithoutPassword = {
        username: 'mock',
        email: 'mock@mock.com',
      };
      const registerUserDTOWithInvalidEmail: RegisterUserDTO = {
        username: 'mock',
        email: 'not an email',
        password: 'mock',
      };

      await request.post(registerRoute).expect(HttpStatus.BAD_REQUEST);
      await request
        .post(registerRoute)
        .send(registerUserDTOWithoutUsername)
        .expect(HttpStatus.BAD_REQUEST);
      await request
        .post(registerRoute)
        .send(registerUserDTOWithoutEmail)
        .expect(HttpStatus.BAD_REQUEST);
      await request
        .post(registerRoute)
        .send(registerUserDTOWithoutPassword)
        .expect(HttpStatus.BAD_REQUEST);
      await request
        .post(registerRoute)
        .send(registerUserDTOWithInvalidEmail)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('POST /logout', () => {
    it('should successfully log out when user is sent', async () => {
      const { user } = await registerUser(registerUserDTO);

      await request.post(logoutRoute).send(user).expect(HttpStatus.OK);
    });

    it('should not log out without sending user', async () => {
      await request.post(logoutRoute).expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('POST /refresh', () => {
    it('should refresh access token', async () => {
      const { tokens } = await registerUser(registerUserDTO);

      const { body } = await request
        .post(refreshRoute)
        .send(tokens)
        .expect(HttpStatus.OK);
      const { accessToken } = body as TokensDTO;

      expect(accessToken).toBeTruthy();
    });

    it('should not refresh access token when no refresh token is sent', async () => {
      await request.post(refreshRoute).expect(HttpStatus.UNAUTHORIZED);
    });
  });
});
