import { Injectable, Scope } from "@nestjs/common";

@Injectable({ scope: Scope.REQUEST })
export class SessaoService {

  public constructor() {
    console.log('Constructor do Sessao Service....')
  }

  public usuarioSessao: string = 'Usuário Sessao Inicial'

}