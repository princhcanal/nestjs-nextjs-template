import { Injectable, OnModuleInit } from '@nestjs/common';
import { ActiveProfilesService } from '../active-profiles/active-profiles.service';
import { UserTestDataService } from './user-test-data.service';

@Injectable()
export class TestDataService implements OnModuleInit {
  constructor(
    private readonly userTestDataService: UserTestDataService,
    private readonly activeProfilesService: ActiveProfilesService
  ) {}

  public async onModuleInit() {
    if (
      this.activeProfilesService.isTestDataProfileActive() ||
      this.activeProfilesService.isTestProfileActive()
    ) {
      await this.generateTestData();
    }
  }

  public async generateTestData() {
    await this.userTestDataService.generateTestData();
  }
}
