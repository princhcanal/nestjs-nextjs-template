import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  public getHello(): string {
    console.log('hello world');
    console.log('goodbye world');
    return this.appService.getHello();
  }

  @Get('/csrf')
  public getCsrfToken(@Req() req: Request) {
    return this.appService.getCsrfToken(req);
  }
}
