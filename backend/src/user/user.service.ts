import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { RegisterUserDTO } from '../authentication/dto/registerUser.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  public async findByEmail(email: string) {
    const user = await this.userRepository.findOne({ email });

    if (user) {
      return user;
    }

    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.BAD_REQUEST,
    );
  }

  public async findById(id: string) {
    const user = await this.userRepository.findOne({ id });

    if (user) {
      return user;
    }

    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  public async register(userData: RegisterUserDTO) {
    const newUser = this.userRepository.create(userData);
    await this.userRepository.save(newUser);
    return newUser;
  }

  public async setCurrentRefreshToken(refreshToken: string, userId: string) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(userId, {
      currentHashedRefreshToken,
    });
  }

  public async getUserIfRefreshTokenMatches(
    refreshToken: string,
    userId: string,
  ) {
    const user = await this.findById(userId);

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  public async deleteRefreshToken(userId: string) {
    return this.userRepository.update(userId, {
      currentHashedRefreshToken: null,
    });
  }
}
