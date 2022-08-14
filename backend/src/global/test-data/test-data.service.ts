import { Injectable } from '@nestjs/common';
import { UserTestDataService } from './user-test-data.service';

@Injectable()
export class TestDataService {
  constructor(private readonly userTestDataService: UserTestDataService) {}

  public async resetTestData() {
    await this.userTestDataService.onModuleInit();
  }
}
