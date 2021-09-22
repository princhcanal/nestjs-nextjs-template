import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AppService {
  public getHello(): string {
    return 'Hello World!';
  }

  public getCsrfToken(req: Request) {
    return { csrfToken: req.csrfToken() };
  }
}
