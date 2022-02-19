import { Controller, Get, Logger, Req } from '@nestjs/common';
import { Request } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @Get()
  public getHello(): string {
    this.logger.log('Hello World!');
    return this.appService.getHello();
  }

  @Get('/csrf')
  public getCsrfToken(@Req() req: Request) {
    return this.appService.getCsrfToken(req);
  }
}
