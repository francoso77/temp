import { Body, Controller, Post } from '@nestjs/common';
import { RespostaPadraoInterface } from '../interfaces/respostaPadrao.interface';
import ClsLoginUsuarioController from '../services/loginUsuario.controller.cls';
import { SessaoService } from '../auth/services/sessao.service';
import { LoginInterface } from '../interfaces/login';

@Controller()
export class LoginUsuarioController {
  constructor(
    // Atribuindo a sessão com o usuário logado,
    private readonly sessao: SessaoService
  ) {
    //console.log('Controller de Login e Permissões do Usuário....')
  }
  @Post('loginUsuario')
  public loginUsuario(
    @Body('email') email: string,
    @Body('senha') senha: string,
  ): Promise<RespostaPadraoInterface<LoginInterface>> {

    return new ClsLoginUsuarioController().logar(email, senha);
  }

  // //verfica quais as permissoes do usuario logado
  // @Post('permissoesUsuario')
  // public permissoesUsuario(): Promise<PermissoesTypeInterface> {
  //   if(this.sessao.usuarioSessao){

  //     return new ClsLoginUsuarioController().permissoesUsuario(this.sessao.usuarioSessao)

  //   } else{
  //     return Promise.reject(null)
  //   }
  // }

  @Post('logoutUsuario')
  public logoutUsuario(
    @Body('email') email: string,
  ): Promise<RespostaPadraoInterface<LoginInterface>> {

    return new ClsLoginUsuarioController().logout(email);
  }
}