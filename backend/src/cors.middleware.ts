import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

Injectable();
export class CorsMiddleware implements NestMiddleware {
  public use(req: Request, res: Response, next: NextFunction) {
    // tslint:disable:no-console
    console.log('headers:', req.headers);
    console.log('referer:', req.headers.referer);
    next();
  }
}
