import { Body, Controller, Post } from '@nestjs/common';
import { RespostaPadraoInterface } from '../interfaces/respostaPadrao.interface';
import ClsLoginUsuarioController from '../services/loginUsuario.controller.cls';
import { PermissoesTypeInterface } from '../types/permissoesTypes';
import { SessaoService } from '../auth/services/sessao.service';

@Controller()
export class LoginUsuarioController {
  constructor(
    // Atribuindo a sessão com o usuário logado,
    private readonly sessao: SessaoService
  ) {
    //console.log('Controller de Login e Permissões do Usuário....')
  }
  //verifica o cpf e senha no login
  @Post('loginUsuario')
  public loginUsuario(
    @Body('cpf') cpf: string,
    @Body('senha') senha: string,
  ): Promise<RespostaPadraoInterface<string>> {

    return new ClsLoginUsuarioController().logar(cpf, senha);
  }

  //verfica quais as permissoes do usuario logado
  @Post('permissoesUsuario')
  public permissoesUsuario(): Promise<PermissoesTypeInterface> {
    if(this.sessao.usuarioSessao){
      
      return new ClsLoginUsuarioController().permissoesUsuario(this.sessao.usuarioSessao)

    } else{
      return Promise.reject(null)
    }
  }
}