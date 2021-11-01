import { SuperTest, Test } from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { AuthenticationController } from '../../src/authentication/authentication.controller';
import { LoginUserDTO } from '../../src/authentication/dto/login-user.dto';
import { RegisterUserDTO } from '../../src/authentication/dto/register-user.dto';
import { MockType } from './utils/mock.type';
import { User } from '../../src/user/user.entity';
import { UserRepository } from '../../src/user/user.repository';
import * as bcrypt from 'bcrypt';
import { UserDTO } from '../../src/user/dto/user.dto';
import { createApp } from './utils/create-app';
import { AccessTokenDTO } from '../../src/authentication/dto/access-token.dto';
import { LoginResponseDTO } from '../../src/authentication/dto/login-response.dto';

describe('AuthenticationController', () => {
  let loginRoute: string;
  let registerRoute: string;
  let logoutRoute: string;
  let refreshRoute: string;
  let mockUserRepository: MockType<UserRepository>;
  let request: SuperTest<Test>;

  beforeAll(async () => {
    const { module, req } = await createApp();
    request = req;

    mockUserRepository = module.get(UserRepository);

    const authRoute = AuthenticationController.AUTH_API_ROUTE;
    loginRoute = authRoute + AuthenticationController.LOGIN_API_ROUTE;
    registerRoute = authRoute + AuthenticationController.REGISTER_API_ROUTE;
    logoutRoute = authRoute + AuthenticationController.LOGOUT_API_ROUTE;
    refreshRoute = authRoute + AuthenticationController.REFRESH_API_ROUTE;
  });

  const createMockUser = async (
    user: LoginUserDTO | RegisterUserDTO
  ): Promise<User> => {
    const mockUser = new User();

    mockUser.id = '';
    mockUser.email = user.email;
    mockUser.createdAt = new Date();
    mockUser.updatedAt = new Date();
    mockUser.password = await bcrypt.hash(user.password, 10);
    mockUser.currentHashedRefreshToken;

    if (user instanceof RegisterUserDTO) {
      mockUser.username = user.username;
    }

    mockUserRepository.create.mockReturnValue(mockUser);
    mockUserRepository.save.mockReturnValue(mockUser);
    mockUserRepository.findOne.mockReturnValue(mockUser);
    mockUserRepository.findByEmail.mockReturnValue(mockUser);

    return mockUser;
  };

  const login = async (loginUserDTO: LoginUserDTO) => {
    const loginUser = await createMockUser(loginUserDTO);

    const { body } = await request
      .post(loginRoute)
      .send(loginUserDTO)
      .expect(HttpStatus.OK);

    const { user, accessToken, refreshToken } = body as LoginResponseDTO;

    expect(user.email).toBe(loginUser.email);
    expect(accessToken).toBeTruthy();
    expect(refreshToken).toBeTruthy();

    return { ...body, loginUser };
  };

  describe('POST /login', () => {
    it('should successfully log in when when email and password are provided', async () => {
      const loginUserDTO: LoginUserDTO = {
        email: 'mock@mock.com',
        password: 'mock',
      };

      login(loginUserDTO);
    });

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
      const registerUserDTO: RegisterUserDTO = {
        username: 'new_mock_user',
        email: 'new_mock@mock.com',
        password: 'mock',
      };

      const registerUser = await createMockUser(registerUserDTO);

      const { body } = await request
        .post(registerRoute)
        .send(registerUserDTO)
        .expect(HttpStatus.CREATED);

      const { user, accessToken, refreshToken } = body as LoginResponseDTO;

      expect(user.email).toBe(registerUser.email);
      expect(accessToken).toBeTruthy();
      expect(refreshToken).toBeTruthy();
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
      const userDTO: UserDTO = {
        id: 'mock_id',
        createdAt: new Date(),
        updatedAt: new Date(),
        email: 'mock@mock.com',
        username: 'mock',
      };

      await request.post(logoutRoute).send(userDTO).expect(HttpStatus.OK);
    });

    it('should not log out without sending user', async () => {
      await request.post(logoutRoute).expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('POST /refresh', () => {
    it('should refresh access token', async () => {
      const loginUserDTO: LoginUserDTO = {
        email: 'mock@mock.com',
        password: 'mock',
      };

      const { refreshToken, loginUser } = await login(loginUserDTO);

      loginUser.currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
      mockUserRepository.findOne.mockReturnValue(loginUser);

      const { body } = await request
        .post(refreshRoute)
        .send({ refreshToken })
        .expect(HttpStatus.OK);
      const { accessToken } = body as AccessTokenDTO;

      expect(accessToken).toBeTruthy();
    });

    it('should not refresh access token when no refresh token is sent', async () => {
      await request.post(refreshRoute).expect(HttpStatus.BAD_REQUEST);
    });
  });
});
