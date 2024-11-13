import { Global, Module } from '@nestjs/common';
import { ContextoService } from './auth/services/contexto.service';
import { SessaoService } from './auth/services/sessao.service';
@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [ContextoService, SessaoService],
  exports: [ContextoService, SessaoService],
})
export class GlobalModule { }