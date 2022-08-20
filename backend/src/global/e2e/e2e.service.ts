import { Injectable } from '@nestjs/common';
import { execSync } from 'child_process';
import { CustomLogger } from '../../shared/custom-logger';

@Injectable()
export class E2EService {
  private readonly logger = new CustomLogger(E2EService.name);

  public resetTestData() {
    this.logger.log('=============================================');
    this.logger.log('RESETTING BACKEND TEST DATA');

    // resets db
    // TODO: prevent command from restarting dev server
    execSync('sleep 2');
    execSync('prisma migrate reset --force');

    // TODO: bring back once prisma migrate reset --force stops restarting dev server
    // generates test data
    // await this.testDataService.resetTestData();

    this.logger.log('DONE RESETTING BACKEND TEST DATA');
    this.logger.log('=============================================');
    this.logger.log('');
  }
}
