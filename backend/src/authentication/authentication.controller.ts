import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { RegisterUserDTO } from './dto/register-user.dto';
import { LoginUserDTO } from './dto/login-user.dto';
import { LoginResponseDTO } from './dto/login-response.dto';
import { UserDTO } from '../user/dto/user.dto';
import { Public } from '../shared/decorators/public.decorator';
import { TokensDTO } from './dto/tokens.dto';

@Controller(AuthenticationController.AUTH_API_ROUTE)
export class AuthenticationController {
  public static readonly AUTH_API_ROUTE = '/auth';
  public static readonly REGISTER_API_ROUTE = '/register';
  public static readonly LOGIN_API_ROUTE = '/login';
  public static readonly LOGOUT_API_ROUTE = '/logout';
  public static readonly REFRESH_API_ROUTE = '/refresh';

  constructor(private readonly authenticationService: AuthenticationService) {}

  @Public()
  @Post(AuthenticationController.REGISTER_API_ROUTE)
  public register(
    @Body() registerUserDTO: RegisterUserDTO
  ): Promise<LoginResponseDTO> {
    return this.authenticationService.register(registerUserDTO);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post(AuthenticationController.LOGIN_API_ROUTE)
  public logIn(@Body() loginUserDTO: LoginUserDTO): Promise<LoginResponseDTO> {
    return this.authenticationService.login(loginUserDTO);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post(AuthenticationController.LOGOUT_API_ROUTE)
  public logOut(@Body() user: UserDTO): void {
    this.authenticationService.logout(user.id);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post(AuthenticationController.REFRESH_API_ROUTE)
  public refresh(@Body() { refreshToken }: TokensDTO): Promise<TokensDTO> {
    return this.authenticationService.refresh(refreshToken);
  }
}
