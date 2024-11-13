import { Injectable } from "@nestjs/common";

@Injectable()
export class ContextoService {

  public constructor() {
    console.log('Constructor do Contexto Service....')
  }

  public usuarioContexto: string = 'Usuário Contexto Inicial'

}