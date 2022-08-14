import NodeEnvironment from 'jest-environment-node';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from 'testcontainers';
import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from '../../src/authentication/authentication.module';
import { UserModule } from '../../src/user/user.module';
import Joi from 'joi';
import { AppController } from '../../src/app.controller';
import { AppService } from '../../src/app.service';
import request from 'supertest';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { PrismaModule } from '../../src/global/prisma/prisma.module';
import { AuthorizationModule } from '../../src/authorization/authorization.module';
import { execSync } from 'child_process';
import { ActiveProfilesModule } from '../../src/global/active-profiles/active-profiles.module';
import { JwtAuthenticationGuard } from '../../src/authentication/guards/jwt-authentication.guard';
import { TestDataModule } from '../../src/global/test-data/test-data.module';
import { Event } from 'jest-circus';
import { E2EModule } from '../../src/global/e2e/e2e.module';

export default class TestEnvironment extends NodeEnvironment {
  private readonly isCiBuild = process.env.IS_CI_BUILD;
  private container: StartedPostgreSqlContainer | undefined;

  constructor(config: any) {
    super(config);
  }

  public async setup() {
    await super.setup();

    if (!this.isCiBuild) {
      await this.setNewTestContainer();
    }

    const moduleFixture = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: ['.env', '.env.local'],
          isGlobal: true,
          validationSchema: Joi.object({
            DATABASE_URL: Joi.string().required(),
            PORT: Joi.number(),
            JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
            JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.number().required(),
            JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
            JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.number().required(),
          }),
        }),
        AuthenticationModule,
        UserModule,
        AuthorizationModule,
        PrismaModule,
        ActiveProfilesModule,
        TestDataModule,
        E2EModule,
      ],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    const app = moduleFixture.createNestApplication();

    const reflector = app.get(Reflector);
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
    app.useGlobalGuards(new JwtAuthenticationGuard(reflector));
    app.use(cookieParser());
    app.use(helmet());

    await app.init();

    this.global.request = request(app.getHttpServer());
  }

  public async teardown() {
    if (this.container) {
      await this.container.stop();
    }
    await super.teardown();
  }

  public getVmContext() {
    return super.getVmContext();
  }

  public async handleTestEvent(event: Event) {
    if (event.name === 'test_done') {
      // reset db
      execSync('prisma migrate reset --force');
    }
  }

  private setDbEnvVars(container: StartedPostgreSqlContainer) {
    process.env.DATABASE_URL = `postgres://${container.getUsername()}:${container.getPassword()}@${container.getHost()}:${container.getPort()}/${container.getDatabase()}`;
  }

  private async setNewTestContainer() {
    this.container = await new PostgreSqlContainer().start();
    this.setDbEnvVars(this.container);
    execSync(`npm run prisma:migrate:dev init`);
  }
}