import { Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Roles } from './auth/roles.decorator';
import { ContextoService } from './auth/services/contexto.service';
import { SessaoService } from './auth/services/sessao.service';


@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly contexto: ContextoService,
    private readonly sessao: SessaoService,
  ) {
    console.log('Construtor do AppController....')
  }

  @Roles({ modulo: 'AppController', permissao: 'getHello' })
  @Post('Hello')
  getHello(): string {
    return this.sessao.usuarioSessao + ' ' + this.appService.getHello();
  }
}
