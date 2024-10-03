import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthAdminMiddleware implements NestMiddleware {

  use(req: Request, res: Response, next: NextFunction) {
    // pegar token e verificar se o token e valido
    // verificar se tem permissao
    console.log("Request Admin...")
    next();
  }
}