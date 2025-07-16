
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SessaoService } from './services/sessao.service';
import { ContextoService } from './services/contexto.service';


@Injectable()
export class LoggerMiddleware implements NestMiddleware {

  constructor(
    private contexto: ContextoService,
    private sessao: SessaoService
  ) {
    //console.log('Constructor do Logger Middleware....')
  }

  use(req: Request, res: Response, next: NextFunction) {

    //console.log("[logger.middleware] - usuarioContexto ", this.contexto.usuarioContexto)
    //console.log("[logger.middleware] - usuarioSessao ", this.sessao.usuarioSessao)

    this.contexto.usuarioContexto = req.body.nomeUsuario || "Usuário/cpf [contexto] Alterado dentro do Middleware"
    this.sessao.usuarioSessao = req.body.nomeUsuario || "Usuário/cpf [sessao] Alterado dentro do Middleware"

    if (req.body.tempo) {

      setTimeout(() => {
        next();
      }, req.body.tempo);

    } else {
      next();
    }
  }
}
