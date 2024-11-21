import { Body, Controller, Post } from "@nestjs/common";
import { RespostaPadraoInterface } from '../interfaces/respostaPadrao.interface';

@Controller()
export class SomarController {

  constructor() {
    console.log('[SomarController] - Construtor')
  }

  @Post("somar")
  public somar(
    @Body("numero01") numero01: number,
    @Body("numero02") numero02: number
  ): Promise<RespostaPadraoInterface<number>> {

    console.log("numero01: ", numero01)
    console.log("numero02: ", numero02)

    return Promise.resolve({ ok: true, mensagem: 'Soma OK', dados: numero01 + numero02 })
  }
}