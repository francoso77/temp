import { Body, Controller, Post } from '@nestjs/common';
import { RespostaPadraoInterface } from '../interfaces/respostaPadrao.interface';
import ClsLoginUsuarioController from '../services/loginUsuario.controller.cls';

@Controller()
export class LoginUsuarioController {
  @Post('loginUsuario')
  loginUsuario(
    @Body('cpf') cpf: string,
    @Body('senha') senha: string,
  ): Promise<RespostaPadraoInterface<string>> {

    return new ClsLoginUsuarioController().logar(cpf, senha);
  }
}