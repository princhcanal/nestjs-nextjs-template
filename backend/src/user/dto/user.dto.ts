import { Role } from '@prisma/client';
import {
  IsArray,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class UserDTO {
  @IsString()
  @IsNotEmpty()
  public id: string;

  @IsDateString()
  public createdAt: Date;

  @IsDateString()
  public updatedAt: Date;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public username: string;

  @IsEnum(Role, { each: true })
  @IsNotEmpty()
  @IsArray()
  public roles: Role[];
}
