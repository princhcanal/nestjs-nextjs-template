import { Module } from '@nestjs/common';
import { AppController } from '../../../src/app.controller';
import { AppService } from '../../../src/app.service';
import { MockAuthenticationModule } from './authentication.mock.module';
import { MockAuthorizationModule } from './authorization.mock.module';
import { MockUserModule } from './user.mock.module';

@Module({
  imports: [MockAuthenticationModule, MockAuthorizationModule, MockUserModule],
  providers: [AppService],
  controllers: [AppController],
})
export class MockAppModule {}
