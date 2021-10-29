import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { RegisterUserDTO } from './dto/registerUser.dto';
import { TokenPayload } from './types/tokenPayload.interface';
import { PostgresErrorCode } from '../database/postgresErrorCodes.enum';
import { LoginUserDTO } from './dto/loginUser.dto';
import { UserDTO } from '../user/dto/user.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  private domain = process.env.NODE_ENV === 'production' ? '.vercel.app' : '';

  public async login(
    loginUserDTO: LoginUserDTO,
    res: Response
  ): Promise<UserDTO> {
    const user = await this.getAuthenticatedUser(
      loginUserDTO.email,
      loginUserDTO.password
    );

    const accessTokenCookie = this.getCookieWithJwtAccessToken(user.id);
    const { cookie: refreshTokenCookie, token: refreshToken } =
      this.getCookieWithRefreshToken(user.id);

    await this.userService.setCurrentRefreshToken(refreshToken, user.id);

    this.setCookies(res, [accessTokenCookie, refreshTokenCookie]);

    return this.userService.toDTO(user);
  }

  public async register(
    registerUserDTO: RegisterUserDTO,
    res: Response
  ): Promise<UserDTO> {
    const { email, password } = registerUserDTO;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      await this.userService.register({
        ...registerUserDTO,
        password: hashedPassword,
      });

      return this.login({ email, password }, res);
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new BadRequestException(
          'User with that username or email already exists'
        );
      }

      throw new InternalServerErrorException('Something went wrong');
    }
  }

  public logout(res: Response, userId: string) {
    const cookies = this.getCookiesForLogOut();
    this.userService.deleteRefreshToken(userId);
    this.setCookies(res, cookies);
  }

  public async refresh(req: Request, res: Response): Promise<UserDTO> {
    const refreshToken = req.cookies?.Refresh;
    if (!refreshToken) throw new UnauthorizedException();
    const payload = this.jwtService.decode(refreshToken) as TokenPayload;

    const user = await this.userService.getUserIfRefreshTokenMatches(
      refreshToken,
      payload.userId
    );

    const accessTokenCookie = this.getCookieWithJwtAccessToken(user.id);
    this.setCookies(res, accessTokenCookie);
    return this.userService.toDTO(user);
  }

  public setCookies(res: Response, cookies: string | string[]) {
    res.setHeader('Set-Cookie', cookies);
  }

  public async getAuthenticatedUser(email: string, plainTextPassword: string) {
    const user = await this.userService.findByEmail(email);
    await this.verifyPassword(plainTextPassword, user.password);
    return user;
  }

  public getCookieWithJwtAccessToken(userId: string) {
    const payload: TokenPayload = { userId };
    const secret = this.configService.get('JWT_ACCESS_TOKEN_SECRET');
    const expiresIn = this.configService.get(
      'JWT_ACCESS_TOKEN_EXPIRATION_TIME'
    );

    const token = this.jwtService.sign(payload, { secret, expiresIn });

    return `Authorization=${token}; HttpOnly; Path=/; Max-Age=${expiresIn}; Domain=${this.domain}; SameSite=None; Secure`;
  }

  public getCookieWithRefreshToken(userId: string) {
    const payload: TokenPayload = { userId };
    const secret = this.configService.get('JWT_REFRESH_TOKEN_SECRET');
    const expiresIn = this.configService.get(
      'JWT_REFRESH_TOKEN_EXPIRATION_TIME'
    );

    const token = this.jwtService.sign(payload, { secret, expiresIn });

    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${expiresIn}; Domain=${this.domain}; SameSite=None; Secure`;

    return { cookie, token };
  }

  public getCookiesForLogOut() {
    return [
      `Authorization=; HttpOnly; Path=/; Max-Age=0; SameSite=None; Domain=${this.domain}; Secure`,
      `Refresh=; HttpOnly; Path=/; Max-Age=0; SameSite=None; Domain=${this.domain}; Secure`,
    ];
  }

  public async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword
    );

    if (!isPasswordMatching) {
      throw new BadRequestException('Wrong credentials provided');
    }
  }
}
