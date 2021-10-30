import { IsString } from 'class-validator';

export class AccessTokenDTO {
  @IsString()
  public accessToken?: string;
}
