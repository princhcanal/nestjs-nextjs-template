import { UserRepository } from '../../../src/user/user.repository';
import { MockType } from '../utils/mock.type';

export const mockRepositoryFactory: () => MockType<UserRepository> = jest.fn(
  () => ({
    findOne: jest.fn(),
    findByEmail: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  })
);
