import { Module } from '@nestjs/common';
import { TestDataService } from './test-data.service';
import { UserTestDataService } from './user-test-data.service';

@Module({
  providers: [TestDataService, UserTestDataService],
  exports: [TestDataService],
})
export class TestDataModule {}
