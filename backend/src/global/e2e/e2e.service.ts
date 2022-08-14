import { Injectable } from '@nestjs/common';
import { execSync } from 'child_process';
import { CustomLogger } from '../../shared/custom-logger';
import { TestDataService } from '../test-data/test-data.service';

@Injectable()
export class E2EService {
  private readonly logger = new CustomLogger(E2EService.name);

  constructor(private readonly testDataService: TestDataService) {}

  public async resetTestData() {
    this.logger.log('=============================================');
    this.logger.log('RESETTING BACKEND TEST DATA');

    // resets db
    // TODO: prevent command from restarting dev server
    execSync('prisma migrate reset --force');

    // generates test data
    await this.testDataService.resetTestData();

    this.logger.log('DONE RESETTING BACKEND TEST DATA');
    this.logger.log('=============================================');
    this.logger.log('');
  }
}
