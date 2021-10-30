import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { RegisterUserDTO } from './dto/register-user.dto';
import { LoginUserDTO } from './dto/login-user.dto';
import { ApiBody } from '@nestjs/swagger';
import { LoginResponseDTO } from './dto/login-response.dto';
import { UserDTO } from '../user/dto/user.dto';
import { RefreshTokenDTO } from './dto/refresh-token.dto';
import { AccessTokenDTO } from './dto/access-token.dto';

@Controller(AuthenticationController.AUTH_API_ROUTE)
export class AuthenticationController {
  public static readonly AUTH_API_ROUTE = '/auth';
  public static readonly REGISTER_API_ROUTE = '/register';
  public static readonly LOGIN_API_ROUTE = '/login';
  public static readonly LOGOUT_API_ROUTE = '/logout';
  public static readonly REFRESH_API_ROUTE = '/refresh';

  constructor(private readonly authenticationService: AuthenticationService) {}

  @ApiBody({ type: RegisterUserDTO })
  @Post(AuthenticationController.REGISTER_API_ROUTE)
  public register(
    @Body() registerUserDTO: RegisterUserDTO
  ): Promise<LoginResponseDTO> {
    return this.authenticationService.register(registerUserDTO);
  }

  @HttpCode(200)
  @ApiBody({ type: LoginUserDTO })
  @Post(AuthenticationController.LOGIN_API_ROUTE)
  public logIn(@Body() loginUserDTO: LoginUserDTO): Promise<LoginResponseDTO> {
    return this.authenticationService.login(loginUserDTO);
  }

  @HttpCode(200)
  @ApiBody({ type: UserDTO })
  @Post(AuthenticationController.LOGOUT_API_ROUTE)
  public logOut(@Body() user: UserDTO): void {
    this.authenticationService.logout(user.id);
  }

  @ApiBody({ type: RefreshTokenDTO })
  @Post(AuthenticationController.REFRESH_API_ROUTE)
  public refresh(
    @Body() { refreshToken }: RefreshTokenDTO
  ): Promise<AccessTokenDTO> {
    return this.authenticationService.refresh(refreshToken);
  }
}
