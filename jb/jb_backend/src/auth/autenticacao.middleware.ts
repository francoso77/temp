
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

    clsAutenticacaoMiddleware.pesquisarToken(req.headers.authorization).then(idUsuario => {
      if (idUsuario > 0) {
        this.sessao.usuarioSessao = idUsuario
        next()
      } else {
        res.status(401).send({ ok: false, mensagem: 'Usuário ou senha inválidos.', dados: null })
      }
    })
  }
}
