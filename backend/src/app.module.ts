import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './authentication/authentication.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthorizationModule } from './authorization/authorization.module';
import { CorsMiddleware } from './cors.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
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
      }),
    }),
    DatabaseModule,
    AuthenticationModule,
    UserModule,
    AuthorizationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorsMiddleware).forRoutes('*');
  }
}
