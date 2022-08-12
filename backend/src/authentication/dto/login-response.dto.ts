import { ValidateNested } from 'class-validator';
import { UserDTO } from '../../user/dto/user.dto';
import { TokensDTO } from './tokens.dto';

export class LoginResponseDTO {
  @ValidateNested()
  public user: UserDTO;

  @ValidateNested()
  public tokens: TokensDTO;
}
