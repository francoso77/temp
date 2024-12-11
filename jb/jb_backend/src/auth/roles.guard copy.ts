import { Injectable, CanActivate, ExecutionContext, Scope, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { SessaoService } from './services/sessao.service';
import { ContextoService } from './services/contexto.service';
import { RolesInterface } from './roles.interface';
import ClsAcesso from '../services/acesso.cls';

//scope do Roles tem que ser igual ao do sessão
@Injectable({ scope: Scope.REQUEST })
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    // private readonly contextoGlobal: ContextoService,
    private readonly sessao: SessaoService
  ) {
    console.log('Constructor do Roles Guard....')
  }

  //tranformar o canactivate em Promise
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RolesInterface>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])


    if (!requiredRoles) {
      // return Promise.resolve(true)
      return true
    }
    const request = context.switchToHttp().getRequest()
    // const clsAcesso = new ClsAcesso()

    // return clsAcesso.checarAcesso(
    //   this.sessao.usuarioSessao,
    //   requiredRoles.modulo,
    //   requiredRoles.permissao).then(checarAcesso => {
    //     return checarAcesso
    //   })
    console.log("[RolesGuard] - Request Headers: ", request.headers.authorization);
    return true
  }
}
