import NodeEnvironment from 'jest-environment-node';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from 'testcontainers';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { execSync } from 'child_process';
import { Event } from 'jest-circus';
import { appModule } from '../../src/shared/app-module';
import { PrismaService } from '../../src/global/prisma/prisma.service';
// https://socket.dev/npm/package/@chax-at/transactional-prisma-testing
import { PrismaTestingHelper } from '@chax-at/transactional-prisma-testing';

export default class TestEnvironment extends NodeEnvironment {
  private readonly isCiBuild = process.env.IS_CI_BUILD;
  private container: StartedPostgreSqlContainer | undefined;
  // Cache for the PrismaTestingHelper. Only one PrismaTestingHelper should be instantiated per test runner (i.e. only one if your tests run sequentially).
  private prismaTestingHelper: PrismaTestingHelper<PrismaService> | undefined;
  // Saves the PrismaService that will be used during test cases. Will always execute queries on the currently active transaction.
  private prismaService: PrismaService;

  constructor(config: any, _context: any) {
    super(config, _context);
  }

  public async setup() {
    await super.setup();

    if (!this.isCiBuild) {
      await this.setNewTestContainer();
    }

    this.setPrisma();

    const moduleFixture = await Test.createTestingModule(appModule)
      .overrideProvider(PrismaService)
      .useValue(this.prismaService)
      .compile();

    const app = moduleFixture.createNestApplication();

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
    if (event.name === 'test_start') {
      await this.beforeEach();
    }

    if (event.name === 'test_done') {
      this.afterEach();
    }
  }

  private setDbEnvVars(container: StartedPostgreSqlContainer) {
    process.env.DATABASE_URL = `postgres://${container.getUsername()}:${container.getPassword()}@${container.getHost()}:${container.getPort()}/${container.getDatabase()}`;
  }

  private async setNewTestContainer() {
    this.container = await new PostgreSqlContainer().start();
    this.setDbEnvVars(this.container);
    execSync(`npm run prisma:migrate:dev:test init`);
  }

  private setPrisma() {
    // Initialize testing helper if it has not been initialized before
    const originalPrismaService = new PrismaService({
      datasources: { db: { url: process.env.DATABASE_URL } },
    });
    // Seed your database / Create source database state that will be used in each test case (if needed)
    // ...
    this.prismaTestingHelper = new PrismaTestingHelper(originalPrismaService);
    // Save prismaService. All calls to this prismaService will be routed to the currently active transaction
    this.prismaService = this.prismaTestingHelper.getProxyClient();
  }

  private async beforeEach(): Promise<void> {
    await this.prismaTestingHelper.startNewTransaction();
  }

  private afterEach(): void {
    this.prismaTestingHelper.rollbackCurrentTransaction();
  }
}
