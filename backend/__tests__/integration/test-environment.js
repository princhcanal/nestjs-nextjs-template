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

// TODO: convert to typescript
export default class TestEnvironment extends NodeEnvironment {
  constructor(config, context) {
    super(config, context);
    this.isCiBuild = process.env.IS_CI_BUILD;
  }

  async setup() {
    await super.setup();

    if (!this.isCiBuild) {
      this.global.container = await new PostgreSqlContainer().start();
    }

    let databaseUrl = process.env.DATABASE_URL;
    let dbUsername;
    let dbPassword;
    let dbHost;
    let dbPort;
    let dbDatabase;

    if (databaseUrl) {
      const [username, passwordAndHost, portAndDatabase] =
        databaseUrl.split(':');
      const [password, host] = passwordAndHost.split('@');
      const [port, database] = portAndDatabase.split('/');
      dbUsername = username;
      dbPassword = password;
      dbHost = host;
      dbPort = +port;
      dbDatabase = database;
      console.log('DB_USERNAME', dbUsername);
      console.log('DB_PASSWORD', dbPassword);
      console.log('DB_HOST', dbHost);
      console.log('DB_DATABASE', dbDatabase);
      console.log('PORT', port);
      console.log('DB_PORT', dbPort);
    }

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
          host: this.isCiBuild ? dbHost : this.global.container.getHost(),
          port: this.isCiBuild ? dbPort : this.global.container.getPort(),
          username: this.isCiBuild
            ? dbUsername
            : this.global.container.getUsername(),
          password: this.isCiBuild
            ? dbPassword
            : this.global.container.getPassword(),
          database: this.isCiBuild
            ? dbDatabase
            : this.global.container.getDatabase(),
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
    await app.init();

    this.global.request = request(app.getHttpServer());

    this.global.transactionalContext = new TransactionalTestContext(
      getConnection()
    );
  }

  async teardown() {
    await super.teardown();

    if (!this.isCiBuild) {
      await this.global.container.stop();
    }
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
