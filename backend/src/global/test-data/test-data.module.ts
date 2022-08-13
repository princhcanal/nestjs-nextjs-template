import { Module } from '@nestjs/common';
import { UserTestDataService } from './user-test-data.service';

@Module({ providers: [UserTestDataService] })
export class TestDataModule {}
