import { Module } from '@nestjs/common';
import { UserRepository } from '../../../src/user/user.repository';
import { UserService } from '../../../src/user/user.service';
import { mockRepositoryFactory } from '../repositories/user.mock.repository';

@Module({
  providers: [
    UserService,
    { provide: UserRepository, useFactory: mockRepositoryFactory },
  ],
  exports: [UserService],
})
export class MockUserModule {}
