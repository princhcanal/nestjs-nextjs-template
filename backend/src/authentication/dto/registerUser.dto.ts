import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterUserDTO {
  @IsEmail({}, { message: 'Invalid email' })
  @IsString()
  @IsNotEmpty({ message: 'Email is required' })
  public email: string;

  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  public username: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(4)
  public password: string;
}
