import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { EnvironmentVariableKeys } from '../shared/constants/environment-variable-keys';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>(
          EnvironmentVariableKeys.JWT_ACCESS_TOKEN_SECRET
        ),
        signOptions: {
          expiresIn: configService.get<string>(
            EnvironmentVariableKeys.JWT_ACCESS_TOKEN_EXPIRATION_TIME
          ),
        },
      }),
    }),
  ],
  providers: [AuthenticationService, JwtStrategy],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
