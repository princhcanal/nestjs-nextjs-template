import { Injectable } from '@nestjs/common';
import { CustomLogger } from '../../shared/custom-logger';
import { PrismaService } from '../prisma/prisma.service';
import { TestDataService } from '../test-data/test-data.service';

@Injectable()
export class E2EService {
  private readonly logger = new CustomLogger(E2EService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly testDataService: TestDataService
  ) {}

  public async resetTestData() {
    this.logger.log('=============================================');
    this.logger.log('RESETTING BACKEND TEST DATA');

    await this.resetDb();

    // generates test data
    await this.testDataService.generateTestData();

    this.logger.log('DONE RESETTING BACKEND TEST DATA');
    this.logger.log('=============================================');
    this.logger.log('');
  }

  private async resetDb() {
    await this.prismaService.$executeRaw`
      CREATE OR REPLACE FUNCTION truncate_tables(username IN VARCHAR) RETURNS void AS $$
      DECLARE
          statements CURSOR FOR
              SELECT tablename FROM pg_tables
              WHERE tableowner = username AND schemaname = 'public';
      BEGIN
          FOR stmt IN statements LOOP
              EXECUTE 'TRUNCATE TABLE ' || quote_ident(stmt.tablename) || ' CASCADE;';
          END LOOP;
      END;
      $$ LANGUAGE plpgsql;
    `;

    await this.prismaService.$executeRaw`SELECT truncate_tables('template')`;
  }
}
