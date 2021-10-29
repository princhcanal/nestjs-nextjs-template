import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

Injectable();
export class CorsMiddleware implements NestMiddleware {
  public use(req: Request, res: Response) {
    // tslint:disable:no-console
    console.log('headers:', req.headers);
    console.log('referer:', req.headers.referer);
  }
}
