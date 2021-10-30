import { IsDateString, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserDTO {
  @IsString()
  @IsNotEmpty({ message: 'Email is required' })
  public id: string;

  @IsDateString(undefined, { message: 'Invalid date string' })
  public createdAt: Date;

  @IsDateString(undefined, { message: 'Invalid date string' })
  public updatedAt: Date;

  @IsEmail({}, { message: 'Invalid email' })
  @IsString()
  @IsNotEmpty({ message: 'Email is required' })
  public email: string;

  @IsString()
  @IsNotEmpty({ message: 'Email is required' })
  public username: string;
}
