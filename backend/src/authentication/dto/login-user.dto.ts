import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDTO {
  @IsEmail({}, { message: 'Invalid email' })
  @IsString()
  @IsNotEmpty({ message: 'Email is required' })
  public email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  public password: string;
}
