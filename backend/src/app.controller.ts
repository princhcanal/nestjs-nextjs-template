import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { CheckPolicies } from './authorization/check-policies.decorator';
import { Handlers } from './authorization/types/handlers';
import { Public } from './shared/decorators/public.decorator';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  public static API_PATH_AUTHORIZATION_TEST = '/authorization-test';

  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  public getHello(): string {
    this.logger.log('Hello World!');
    return this.appService.getHello();
  }

  @Get(AppController.API_PATH_AUTHORIZATION_TEST)
  @CheckPolicies(Handlers.CanManageAll)
  public authorizationTest(): string {
    return this.appService.getAuthorizationTest();
  }
}
