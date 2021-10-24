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
import { Response } from 'express';
import { AuthenticationService } from './authentication.service';
import { JwtAuthenticationGuard } from './guards/jwtAuthentication.guard';
import { RequestWithUser } from './types/requestWithUser.interface';
import { JwtRefreshGuard } from './guards/jwtRefresh.guard';
import { RegisterUserDTO } from './dto/registerUser.dto';
import { LoginUserDTO } from './dto/loginUser.dto';
import { ApiBody } from '@nestjs/swagger';
import { UserDTO } from '../user/dto/user.dto';

@Controller(AuthenticationController.AUTH_API_ROUTE)
export class AuthenticationController {
  public static readonly AUTH_API_ROUTE = '/auth';

  constructor(private readonly authenticationService: AuthenticationService) {}

  @ApiBody({ type: RegisterUserDTO })
  @Post('register')
  public register(
    @Body() registerUserDTO: RegisterUserDTO,
    @Res({ passthrough: true }) res: Response
  ): Promise<UserDTO> {
    return this.authenticationService.register(registerUserDTO, res);
  }

  @HttpCode(200)
  @ApiBody({ type: LoginUserDTO })
  @Post('login')
  public logIn(
    @Body() loginUserDTO: LoginUserDTO,
    @Res({ passthrough: true }) res: Response
  ): Promise<UserDTO> {
    return this.authenticationService.login(loginUserDTO, res);
  }

  @HttpCode(200)
  @UseGuards(JwtAuthenticationGuard)
  @Post('logout')
  public logOut(@Req() req: RequestWithUser, @Res() res: Response): void {
    this.authenticationService.logout(res, req.user.id);
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  public refresh(@Req() req: RequestWithUser, @Res() res: Response): UserDTO {
    return this.authenticationService.refresh(res, req.user);
  }
}
