import { Module } from '@nestjs/common';
import { TestDataModule } from '../test-data/test-data.module';
import { E2EController } from './e2e.controller';
import { E2EService } from './e2e.service';

@Module({
  imports: [TestDataModule],
  controllers: [E2EController],
  providers: [E2EService],
})
export class E2EModule {}
