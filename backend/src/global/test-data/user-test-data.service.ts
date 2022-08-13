import { Injectable, OnModuleInit } from '@nestjs/common';
import { ActiveProfilesService } from '../active-profiles/active-profiles.service';
import { RegisterUserDTO } from '../../authentication/dto/register-user.dto';
import { PrismaService } from '../../global/prisma/prisma.service';
import bcrypt from 'bcrypt';
import { CustomLogger } from '../../shared/custom-logger';

export const testUser: RegisterUserDTO = {
  email: 'test@test.com',
  username: 'test',
  password: 'test',
};

@Injectable()
export class UserTestDataService implements OnModuleInit {
  private readonly logger = new CustomLogger(UserTestDataService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly activeProfilesService: ActiveProfilesService
  ) {}

  public async onModuleInit() {
    if (
      this.activeProfilesService.isTestDataProfileActive() ||
      this.activeProfilesService.isTestProfileActive()
    ) {
      this.logger.log('GENERATING USER TEST DATA');
      await this.generateData();
      this.logger.log('DONE GENERATING USER TEST DATA');
    }
  }

  private async generateData() {
    const foundUser = await this.prismaService.user.findUnique({
      where: { email: testUser.email },
    });

    if (!foundUser) {
      this.logger.log('GENERATING TEST USER');
      await this.createUser(testUser);
    }
  }

  private async createUser(dto: RegisterUserDTO) {
    await this.prismaService.user.create({
      data: { ...dto, password: await bcrypt.hash(dto.password, 10) },
    });
  }
}
