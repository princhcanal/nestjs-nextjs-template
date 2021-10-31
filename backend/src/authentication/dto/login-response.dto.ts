import { IsJWT } from 'class-validator';
import { UserDTO } from '../../user/dto/user.dto';

export class LoginResponseDTO {
  public user: UserDTO;

  @IsJWT()
  public accessToken: string;

  @IsJWT()
  public refreshToken: string;
}
