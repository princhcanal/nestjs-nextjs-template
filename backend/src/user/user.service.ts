import { Injectable, NotFoundException } from '@nestjs/common';
import { RegisterUserDTO } from '../authentication/dto/register-user.dto';
import bcrypt from 'bcrypt';
import { PrismaService } from '../global/prisma/prisma.service';
import { User } from '@prisma/client';
import { UserDTO } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  public async findByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (user) {
      return user;
    }

    throw new NotFoundException('User with this email does not exist');
  }

  public async findById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (user) {
      return user;
    }

    throw new NotFoundException('User with this id does not exist');
  }

  public async register(data: RegisterUserDTO): Promise<User> {
    return this.prisma.user.create({ data });
  }

  public async setCurrentRefreshToken(
    refreshToken: string,
    userId: string
  ): Promise<void> {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await this.prisma.user.update({
      data: { currentHashedRefreshToken },
      where: { id: userId },
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

  public async deleteRefreshToken(userId: string): Promise<User> {
    return this.prisma.user.update({
      data: { currentHashedRefreshToken: null },
      where: { id: userId },
    });
  }

  public convertToDTO(user: User): UserDTO {
    const { id, createdAt, updatedAt, email, username, roles } = user;

    const userDTO: UserDTO = {
      id,
      createdAt,
      updatedAt,
      email,
      username,
      roles,
    };

    return userDTO;
  }
}
