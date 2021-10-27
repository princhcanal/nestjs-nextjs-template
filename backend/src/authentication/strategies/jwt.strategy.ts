import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';
import { TokenPayload } from '../types/tokenPayload.interface';
import { Request } from 'express';
import { User } from '../../user/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const authToken = req.cookies.Authorization;
          const refreshToken = req.cookies.Refresh;

          if (authToken) {
            return authToken;
          }

          throw new UnauthorizedException({
            message: 'Forbidden',
            retryWithRefreshToken: !!refreshToken,
          });
        },
      ]),
      secretOrKey: configService.get('JWT_ACCESS_TOKEN_SECRET'),
    });
  }

  public async validate(payload: TokenPayload): Promise<User> {
    return this.userService.findById(payload.userId);
  }
}
