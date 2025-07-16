import { Injectable, Scope } from "@nestjs/common";

//scope da sessão tem que ser igual ao do RolesGuard
@Injectable({ scope: Scope.REQUEST })
export class SessaoService {

  public constructor() {
    //console.log('Constructor do Sessao Service....')
  }

  public usuarioSessao: number = 0

}