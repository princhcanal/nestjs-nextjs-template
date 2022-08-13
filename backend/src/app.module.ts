import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './authentication/authentication.module';
import { UserModule } from './user/user.module';
import { AuthorizationModule } from './authorization/authorization.module';
import { PrismaModule } from './global/prisma/prisma.module';
import { ActiveProfilesModule } from './global/active-profiles/active-profiles.module';
import { TestDataModule } from './global/test-data/test-data.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.local'],
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        HEROKU_APP_NAME: Joi.string(),
        HEROKU_BRANCH: Joi.string(),
        HEROKU_PR_NUMBER: Joi.number(),
        PORT: Joi.number(),
        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.number().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.number().required(),
        ACTIVE_PROFILES: Joi.string(),
      }),
    }),
    AuthenticationModule,
    UserModule,
    AuthorizationModule,
    PrismaModule,
    ActiveProfilesModule,
    TestDataModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
