import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../global/prisma/prisma.service';
import bcrypt from 'bcrypt';
import { CustomLogger } from '../../shared/custom-logger';
import { User, Role } from '@prisma/client';

export const testUser: User = {
  id: '2f54ca0b-e389-4e17-a978-0cb98e0f7a46',
  createdAt: new Date(),
  updatedAt: new Date(),
  email: 'test@test.com',
  username: 'test',
  password: 'test',
  currentHashedRefreshToken: undefined,
  roles: [Role.USER],
};

export const testAdmin: User = {
  id: '2cf38670-0a8a-41e9-9018-e8b8a9b36486',
  createdAt: new Date(),
  updatedAt: new Date(),
  email: 'test_admin@test.com',
  username: 'test_admin',
  password: 'test',
  currentHashedRefreshToken: undefined,
  roles: [Role.USER, Role.ADMIN],
};

@Injectable()
export class UserTestDataService {
  private readonly logger = new CustomLogger(UserTestDataService.name);

  constructor(private readonly prismaService: PrismaService) {}

  public async generateTestData() {
    this.logger.log('GENERATING USER TEST DATA');

    const foundUser = await this.prismaService.user.findUnique({
      where: { id: testUser.id },
    });
    const foundAdmin = await this.prismaService.user.findUnique({
      where: { id: testAdmin.id },
    });

    if (!foundUser) {
      this.logger.log('GENERATING TEST USER');
      await this.createUser(testUser);
    }
    if (!foundAdmin) {
      this.logger.log('GENERATING TEST ADMIN');
      await this.createUser(testAdmin);
    }

    this.logger.log('DONE GENERATING USER TEST DATA');
  }

  private async createUser(user: User) {
    await this.prismaService.user.create({
      data: { ...user, password: await bcrypt.hash(user.password, 10) },
    });
  }
}
