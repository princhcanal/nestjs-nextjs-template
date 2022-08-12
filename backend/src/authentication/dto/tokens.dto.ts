import { IsJWT, IsOptional } from 'class-validator';

export class TokensDTO {
  @IsJWT()
  @IsOptional()
  public accessToken?: string;

  @IsJWT()
  @IsOptional()
  public refreshToken?: string;
}
