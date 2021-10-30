import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { RegisterUserDTO } from './dto/register-user.dto';
import { TokenPayload } from './types/tokenPayload.interface';
import { PostgresErrorCode } from '../database/postgresErrorCodes.enum';
import { LoginUserDTO } from './dto/login-user.dto';
import { LoginResponseDTO } from './dto/login-response.dto';
import { AccessTokenDTO } from './dto/access-token.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  public async login(loginUserDTO: LoginUserDTO): Promise<LoginResponseDTO> {
    const user = await this.getAuthenticatedUser(
      loginUserDTO.email,
      loginUserDTO.password
    );

    const accessToken = this.getJwtAccessToken(user.id);
    const refreshToken = this.getRefreshToken(user.id);

    await this.userService.setCurrentRefreshToken(refreshToken, user.id);

    const userDTO = user.toDTO();

    return {
      user: userDTO,
      accessToken,
      refreshToken,
    };
  }

  public async register(
    registerUserDTO: RegisterUserDTO
  ): Promise<LoginResponseDTO> {
    const { email, password } = registerUserDTO;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      await this.userService.register({
        ...registerUserDTO,
        password: hashedPassword,
      });

      return this.login({ email, password });
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new BadRequestException(
          'User with that username or email already exists'
        );
      }

      throw new InternalServerErrorException('Something went wrong');
    }
  }

  public logout(userId: string) {
    this.userService.deleteRefreshToken(userId);
  }

  public async refresh(refreshToken?: string): Promise<AccessTokenDTO> {
    if (!refreshToken)
      throw new UnauthorizedException({ invalidRefreshToken: true });

    const payload = this.jwtService.decode(refreshToken) as TokenPayload;

    if (this.tokenExpired(payload.exp)) {
      throw new UnauthorizedException({ invalidRefreshToken: true });
    }

    const user = await this.userService.getUserIfRefreshTokenMatches(
      refreshToken,
      payload.userId
    );

    const accessToken = this.getJwtAccessToken(user.id);

    return { accessToken };
  }

  public async getAuthenticatedUser(email: string, plainTextPassword: string) {
    const user = await this.userService.findByEmail(email);
    await this.verifyPassword(plainTextPassword, user.password);
    return user;
  }

  public getJwtAccessToken(userId: string) {
    const payload: TokenPayload = { userId };
    const secret = this.configService.get('JWT_ACCESS_TOKEN_SECRET');
    const expiresIn = this.configService.get(
      'JWT_ACCESS_TOKEN_EXPIRATION_TIME'
    );

    const token = this.jwtService.sign(payload, { secret, expiresIn });

    return token;
  }

  public getRefreshToken(userId: string) {
    const payload: TokenPayload = { userId };
    const secret = this.configService.get('JWT_REFRESH_TOKEN_SECRET');
    const expiresIn = this.configService.get(
      'JWT_REFRESH_TOKEN_EXPIRATION_TIME'
    );

    const token = this.jwtService.sign(payload, { secret, expiresIn });

    return token;
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

  public tokenExpired(exp: number) {
    return Date.now() > exp * 1000;
  }
}
