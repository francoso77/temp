
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SessaoService } from './services/sessao.service';
import ClsAutenticacaoMiddleware from '../services/autenticacao.middleware.cls';


@Injectable()
export class AutenticacaoMiddleware implements NestMiddleware {

  constructor(
    private readonly sessao: SessaoService
  ) { }

  use(req: Request, res: Response, next: NextFunction) {

    const clsAutenticacaoMiddleware = new ClsAutenticacaoMiddleware()

    console.log("[AutenticacaoMiddleware] - req.headers.authorization: ", req.headers.authorization)

    clsAutenticacaoMiddleware.pesquisarToken(req.headers.authorization).then(idUsuario => {

      console.log("[AutenticacaoMiddleware] - idUsuario: ", idUsuario)

      this.sessao.usuarioSessao = idUsuario
      next()

      // if (idUsuario) {
      //   this.sessao.usuarioSessao = idUsuario
      //   next()
      // } else {
      //   res.status(401).send({ ok: false, mensagem: 'Token invalido', dados: null })
      //   next()
      // }
    })
  }
}
