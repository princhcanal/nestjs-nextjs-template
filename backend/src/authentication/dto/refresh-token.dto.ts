import { IsJWT } from 'class-validator';

export class RefreshTokenDTO {
  @IsJWT()
  public refreshToken?: string;
}
