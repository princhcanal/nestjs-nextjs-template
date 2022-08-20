import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  public getHello(): string {
    return 'Hello World!';
  }

  public getAuthorizationTest(): string {
    return 'Authorization Passed!';
  }
}
