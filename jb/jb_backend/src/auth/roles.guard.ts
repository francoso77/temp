import { Injectable, CanActivate, ExecutionContext, Scope, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { SessaoService } from './services/sessao.service';
import { ContextoService } from './services/contexto.service';
import { RoleInterface } from './roles.interface';

const PERMISSOES: RoleInterface[] = [
  { modulo: 'clientes', permissao: 'incluir' },
  { modulo: 'login', permissao: 'logar' },
  { modulo: 'pedidos', permissao: 'consultar' },
  { modulo: 'entradas', permissao: 'deletar' },
  { modulo: 'estoques', permissao: 'consultar' },
  { modulo: 'crud', permissao: 'pesquisar' },
]
@Injectable({ scope: Scope.REQUEST })
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    // private readonly contextoGlobal: ContextoService,
    // private readonly sessao: SessaoService
  ) {
    console.log('Constructor do Roles Guard....')
  }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleInterface>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const { nomeUsuario, tempo } = context.switchToHttp().getRequest().body;
    const { cpf, senha } = context.switchToHttp().getRequest().body;

    // console.log("[RolesGuard] - nomeUsuario: ", nomeUsuario)
    // console.log("[RolesGuard] - tempo: ", tempo)
    // console.log("[RolesGuard] - ContextoGlobal: ", this.contextoGlobal.usuarioContexto)
    // console.log("[RolesGuard] - ContextoSessao: ", this.sessao.usuarioSessao)
    // console.log("[RolesGuard] - cpf: ", cpf)
    // console.log("[RolesGuard] - senha: ", senha)
    // console.log("[RolesGuard] - requiredRoles: ", requiredRoles)

    if (!requiredRoles) {
      return false;
    } else {

      let permissao = PERMISSOES.find((permissao) => permissao.modulo === requiredRoles.modulo && permissao.permissao === requiredRoles.permissao)

      if (!permissao) {
        throw new HttpException('Acesso negado', HttpStatus.FORBIDDEN);
      }
    }

    return true

    // const { user } = context.switchToHttp().getRequest();
    // return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
