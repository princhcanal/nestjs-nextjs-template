import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  public getHello(): string {
    return this.appService.getHello();
  }

  @Get('/csrf')
  public getCsrfToken(@Req() req: Request) {
    return this.appService.getCsrfToken(req);
  }
}
