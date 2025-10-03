import { MiddlewareConsumer, Module } from "@nestjs/common";
import { CrudController } from './controllers/crud.controller';
import { OutController } from './controllers/out.controller';
import { RolesGuard } from './auth/roles.guard';
import { APP_GUARD } from '@nestjs/core';
import { GlobalModule } from './global.module';
import { LoginUsuarioController } from './controllers/loginUsuario.controller';
import { AutenticacaoMiddleware } from './auth/autenticacao.middleware';
import { SomarController } from './controllers/somar.controller';
import { SessaoService } from './auth/services/sessao.service';
import { ConfigModule } from "@nestjs/config";
import { NotificationController } from './controllers/notification.controller';


@Module({
  imports: [
    ConfigModule.forRoot(
      {
        envFilePath: '.env',
      }
    ),
    GlobalModule,
  ],
  controllers: [
    CrudController,
    OutController,
    LoginUsuarioController,
    SomarController,
    NotificationController,
  ],
  providers: [SessaoService,
    {
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
