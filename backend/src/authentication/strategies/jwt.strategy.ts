import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';
import { User } from '@prisma/client';
import { TokenPayload } from '../types/token-payload.interface';
import { ActiveProfilesService } from '../../global/active-profiles/active-profiles.service';
import { EnvironmentVariableKeys } from '../../shared/constants/environment-variable-keys';
import { testUser } from '../../global/test-data/user-test-data.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // tslint:disable:no-unused-variable
  constructor(
    private readonly configService: ConfigService,
    private readonly activeProfilesService: ActiveProfilesService,
    private readonly userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>(
        EnvironmentVariableKeys.JWT_ACCESS_TOKEN_SECRET
      ),
    });
  }

  public async validate(payload: TokenPayload): Promise<User> {
    if (this.activeProfilesService.isTestProfileActive()) {
      return this.userService.findByEmail(testUser.email);
    }

    return this.userService.findById(payload.userId);
  }
}
