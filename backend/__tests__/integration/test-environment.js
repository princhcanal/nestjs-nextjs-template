import * as NodeEnvironment from 'jest-environment-node';
import { PostgreSqlContainer } from 'testcontainers';
import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationModule } from '../../src/authentication/authentication.module';
import { UserModule } from '../../src/user/user.module';
import * as Joi from 'joi';
import { AppController } from '../../src/app.controller';
import { AppService } from '../../src/app.service';
import * as request from 'supertest';
import { TransactionalTestContext } from 'typeorm-transactional-tests';
import { getConnection } from 'typeorm';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

// TODO: convert to typescript
export default class TestEnvironment extends NodeEnvironment {
  constructor(config, context) {
    super(config, context);
  }

  async setup() {
    await super.setup();

    this.global.container = await new PostgreSqlContainer().start();

    const moduleFixture = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          validationSchema: Joi.object({
            DATABASE_URL: Joi.string().required(),
            PORT: Joi.number(),
            JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
            JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.number().required(),
            JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
            JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.number().required(),
          }),
        }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: this.global.container.getHost(),
          port: this.global.container.getPort(),
          username: this.global.container.getUsername(),
          password: this.global.container.getPassword(),
          database: this.global.container.getDatabase(),
          entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
          synchronize: true,
        }),
        AuthenticationModule,
        UserModule,
      ],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    const app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.use(cookieParser());
    await app.init();

    this.global.request = request(app.getHttpServer());

    this.global.transactionalContext = new TransactionalTestContext(
      getConnection()
    );
  }

  async teardown() {
    await super.teardown();

    await this.global.container.stop();
  }

  getVmContext() {
    return super.getVmContext();
  }

  // TODO: log in before all tests
  async handleTestEvent(event, state) {
    if (event.name === 'test_start') {
      // Start transaction
      await this.global.transactionalContext.start();
    } else if (event.name === 'test_done') {
      // Rollback transaction
      await this.global.transactionalContext.finish();
    }
  }
}
