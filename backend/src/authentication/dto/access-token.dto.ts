import { IsJWT } from 'class-validator';

export class AccessTokenDTO {
  @IsJWT()
  public accessToken?: string;
}
