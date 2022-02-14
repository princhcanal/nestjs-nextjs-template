import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthenticationController } from '../../../src/authentication/authentication.controller';
import { AuthenticationService } from '../../../src/authentication/authentication.service';
import { JwtStrategy } from '../../../src/authentication/strategies/jwt.strategy';
import { EnvironmentVariableKeys } from '../../../src/config/environment-variable-keys';
import { MockUserModule } from './user.mock.module';

@Module({
  imports: [
    MockUserModule,
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get(
          EnvironmentVariableKeys.JWT_ACCESS_TOKEN_SECRET
        ),
        signOptions: {
          expiresIn: configService.get(
            EnvironmentVariableKeys.JWT_ACCESS_TOKEN_EXPIRATION_TIME
          ),
        },
      }),
    }),
  ],
  providers: [AuthenticationService, JwtStrategy],
  controllers: [AuthenticationController],
})
export class MockAuthenticationModule {}
