import { Injectable, CanActivate, ExecutionContext, Scope } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SessaoService } from './services/sessao.service';
import { ROLES_KEY } from './roles.decorator';
import { RolesInterface } from './roles.interface'; // Supondo que a interface foi separada
import ClsAcesso from '../services/acesso.cls';

@Injectable({ scope: Scope.REQUEST }) // Escopo igual ao do SessaoService
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly sessao: SessaoService, // Injeta o SessaoService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Recupera as roles necessárias do metadata
    const requiredRoles = this.reflector.getAllAndOverride<RolesInterface[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // Se nenhuma role for necessária, permite o acesso
    }

    // Obtém o usuário da sessão
    const usuarioAtual = this.sessao.usuarioSessao;

    if (!usuarioAtual) {
      return false; // Bloqueia se o usuário não estiver na sessão
    }

    // Valida o acesso às roles necessárias usando a classe ClsAcesso
    const acesso = new ClsAcesso()
    const acessos = await Promise.all(
      requiredRoles.map((role) => acesso.checarAcesso(usuarioAtual, role.modulo, role.permissao))
    );

    // Retorna true se qualquer validação for bem-sucedida
    return acessos.some(Boolean);

  }
}
