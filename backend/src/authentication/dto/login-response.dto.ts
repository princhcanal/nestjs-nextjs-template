import { IsString } from 'class-validator';
import { UserDTO } from '../../user/dto/user.dto';

export class LoginResponseDTO {
  public user: UserDTO;

  @IsString()
  public accessToken: string;

  @IsString()
  public refreshToken: string;
}
