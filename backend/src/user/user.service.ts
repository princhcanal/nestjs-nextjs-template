import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import { User } from './user.entity';
import { RegisterUserDTO } from '../authentication/dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);

    if (user) {
      return user;
    }

    throw new NotFoundException('User with this email does not exist');
  }

  public async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ id });

    if (user) {
      return user;
    }

    throw new NotFoundException('User with this id does not exist');
  }

  public async register(userData: RegisterUserDTO): Promise<User> {
    const newUser = this.userRepository.create(userData);
    await this.userRepository.save(newUser);
    return newUser;
  }

  public async setCurrentRefreshToken(
    refreshToken: string,
    userId: string
  ): Promise<void> {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(userId, {
      currentHashedRefreshToken,
    });
  }

  public async getUserIfRefreshTokenMatches(
    refreshToken: string,
    userId: string
  ): Promise<User> {
    const user = await this.findById(userId);

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  public async deleteRefreshToken(userId: string): Promise<UpdateResult> {
    return this.userRepository.update(userId, {
      currentHashedRefreshToken: null,
    });
  }
}
