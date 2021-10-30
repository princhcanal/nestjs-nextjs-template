import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AuthenticationController } from '../../src/authentication/authentication.controller';
import { AuthenticationService } from '../../src/authentication/authentication.service';
import { LoginUserDTO } from '../../src/authentication/dto/login-user.dto';
import { RegisterUserDTO } from '../../src/authentication/dto/register-user.dto';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from '../../src/authentication/strategies/jwt.strategy';
import { UserService } from '../../src/user/user.service';
import * as cookieParser from 'cookie-parser';

xdescribe('AuthenticationController', () => {
  let app: INestApplication;
  let req: request.SuperTest<request.Test>;
  let loginRoute: string;
  let registerRoute: string;
  let logoutRoute: string;
  let refreshRoute: string;

  beforeAll(async () => {
    process.env.JWT_ACCESS_TOKEN_SECRET = 'mock_secret';
    process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME = '86400';
    process.env.JWT_REFRESH_TOKEN_SECRET = 'template_refresh';
    process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME = '31540000';

    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule,
        PassportModule,
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get('JWT_ACCESS_TOKEN_SECRET'),
            signOptions: {
              expiresIn: configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
            },
          }),
        }),
      ],
      controllers: [AuthenticationController],
      providers: [
        UserService,
        AuthenticationService,
        ConfigService,
        JwtStrategy,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.use(cookieParser());
    await app.init();

    req = request(app.getHttpServer());

    loginRoute =
      AuthenticationController.AUTH_API_ROUTE +
      AuthenticationController.LOGIN_API_ROUTE;
    registerRoute =
      AuthenticationController.AUTH_API_ROUTE +
      AuthenticationController.REGISTER_API_ROUTE;
    logoutRoute =
      AuthenticationController.AUTH_API_ROUTE +
      AuthenticationController.LOGOUT_API_ROUTE;
    refreshRoute =
      AuthenticationController.AUTH_API_ROUTE +
      AuthenticationController.REFRESH_API_ROUTE;
  });

  describe('/login', () => {
    it('should return user when email and password are provided', async () => {
      const loginUserDTO: LoginUserDTO = {
        email: 'mock@mock.com',
        password: 'mock',
      };

      await req.post(loginRoute).send(loginUserDTO).expect(200);
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

      await req.post(loginRoute).expect(400);
      await req.post(loginRoute).send(loginUserDTOWithoutEmail).expect(400);
      await req.post(loginRoute).send(loginUserDTOWithoutPassword).expect(400);
      await req.post(loginRoute).send(loginUserDTOWithInvalidEmail).expect(400);
    });
  });

  describe('/register', () => {
    it('should return user when username, email, and password are provided', async () => {
      const registerUserDTO: RegisterUserDTO = {
        username: 'new_mock_user',
        email: 'new_mock@mock.com',
        password: 'mock',
      };

      await req.post(registerRoute).send(registerUserDTO).expect(201);
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

      await req.post(registerRoute).expect(400);
      await req
        .post(registerRoute)
        .send(registerUserDTOWithoutUsername)
        .expect(400);
      await req
        .post(registerRoute)
        .send(registerUserDTOWithoutEmail)
        .expect(400);
      await req
        .post(registerRoute)
        .send(registerUserDTOWithoutPassword)
        .expect(400);
      await req
        .post(registerRoute)
        .send(registerUserDTOWithInvalidEmail)
        .expect(400);
    });
  });

  describe('/logout', () => {
    it('should log out with valid auth token', async () => {
      const registerUserDTO: RegisterUserDTO = {
        username: 'new_mock_user',
        email: 'new_mock@mock.com',
        password: 'mock',
      };

      const registerResponse = await req
        .post(registerRoute)
        .send(registerUserDTO)
        .expect(201);
      const [authTokenCookie] = registerResponse.get('Set-Cookie');

      await req.post(logoutRoute).set('Cookie', [authTokenCookie]).expect(200);
    });

    it('should not log out with no auth token', async () => {
      await req.post(logoutRoute).expect(401);
    });

    it('should not log out with invalid auth token', async () => {
      await req
        .post(logoutRoute)
        .set('Cookie', ['Authorization=mock'])
        .expect(401);
    });
  });

  describe('/refresh', () => {
    it('should successfully refresh tokens', async () => {
      await req.get(refreshRoute).expect(200);
    });
  });
});
