import { MiddlewareConsumer, Module } from "@nestjs/common";
import { CrudController } from './controllers/crud.controller';
import { OutController } from './controllers/out.controller';
import { RolesGuard } from './auth/roles.guard';
import { AppService } from './app.service';
import { APP_GUARD } from '@nestjs/core';
import { GlobalModule } from './global.module';
import { AppController } from './app.controller';
import { LoginUsuarioController } from './controllers/loginUsuario.controller';
import { AutenticacaoMiddleware } from './auth/autenticacao.middleware';

@Module({
  imports: [GlobalModule],
  controllers: [CrudController, OutController, AppController, LoginUsuarioController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: RolesGuard,
  }],
  exports: []
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AutenticacaoMiddleware)
      .forRoutes('*');
  }
}
