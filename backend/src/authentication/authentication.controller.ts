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
import { Request, Response } from 'express';
import { AuthenticationService } from './authentication.service';
import { JwtAuthenticationGuard } from './guards/jwtAuthentication.guard';
import { RequestWithUser } from './types/requestWithUser.interface';
import { RegisterUserDTO } from './dto/registerUser.dto';
import { LoginUserDTO } from './dto/loginUser.dto';
import { ApiBody } from '@nestjs/swagger';
import { UserDTO } from '../user/dto/user.dto';

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
    @Body() registerUserDTO: RegisterUserDTO,
    @Res({ passthrough: true }) res: Response
  ): Promise<UserDTO> {
    return this.authenticationService.register(registerUserDTO, res);
  }

  @HttpCode(200)
  @ApiBody({ type: LoginUserDTO })
  @Post(AuthenticationController.LOGIN_API_ROUTE)
  public logIn(
    @Body() loginUserDTO: LoginUserDTO,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<UserDTO> {
    // tslint:disable:no-console
    console.log('headers:', req.headers);
    console.log('referer:', req.headers.referer);
    return this.authenticationService.login(loginUserDTO, res);
  }

  @HttpCode(200)
  @UseGuards(JwtAuthenticationGuard)
  @Post(AuthenticationController.LOGOUT_API_ROUTE)
  public logOut(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response
  ): void {
    this.authenticationService.logout(res, req.user.id);
  }

  @Get(AuthenticationController.REFRESH_API_ROUTE)
  public refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<UserDTO> {
    return this.authenticationService.refresh(req, res);
  }
}
