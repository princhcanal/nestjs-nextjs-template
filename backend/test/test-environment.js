const NodeEnvironment = require('jest-environment-node');
const { PostgreSqlContainer } = require('testcontainers');
const { Test } = require('@nestjs/testing');
const { ConfigModule } = require('@nestjs/config');
const { TypeOrmModule } = require('@nestjs/typeorm');
const {
  AuthenticationModule,
} = require('../src/authentication/authentication.module');
const { UserModule } = require('../src/user/user.module');
const Joi = require('joi');
const { AppController } = require('../src/app.controller');
const { AppService } = require('../src/app.service');
const request = require('supertest');
const { TransactionalTestContext } = require('typeorm-transactional-tests');
const { getConnection } = require('typeorm');

// TODO: convert to typescript
class TestEnvironment extends NodeEnvironment {
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
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
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

module.exports = TestEnvironment;
