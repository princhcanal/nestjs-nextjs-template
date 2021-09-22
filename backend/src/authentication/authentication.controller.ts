import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Res,
  Req,
  Get,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthenticationService } from './authentication.service';
import { JwtAuthenticationGuard } from './guards/jwtAuthentication.guard';
import { RequestWithUser } from './types/requestWithUser.interface';
import { JwtRefreshGuard } from './guards/jwtRefresh.guard';
import { RegisterUserDTO } from './dto/registerUser.dto';
import { LoginUserDTO } from './dto/loginUser.dto';

@Controller(AuthenticationController.AUTH_API_ROUTE)
export class AuthenticationController {
  public static readonly AUTH_API_ROUTE = '/auth';

  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register')
  public register(
    @Body() registerUserDTO: RegisterUserDTO,
    @Res() res: Response,
  ) {
    return this.authenticationService.register(registerUserDTO, res);
  }

  @HttpCode(200)
  @Post('login')
  public logIn(@Body() loginUserDTO: LoginUserDTO, @Res() res: Response) {
    return this.authenticationService.login(loginUserDTO, res);
  }

  @HttpCode(200)
  @UseGuards(JwtAuthenticationGuard)
  @Post('logout')
  public logOut(@Req() req: RequestWithUser, @Res() res: Response) {
    return this.authenticationService.logout(res, req.user.id);
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  public refresh(@Req() req: RequestWithUser, @Res() res: Response) {
    this.authenticationService.refresh(res, req.user);
  }
}
