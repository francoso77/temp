import { MiddlewareConsumer, Module } from "@nestjs/common";
import { CrudController } from './controllers/crud.controller';
import { OutController } from './controllers/out.controller';
import { RolesGuard } from './auth/roles.guard';
import { APP_GUARD } from '@nestjs/core';
import { GlobalModule } from './global.module';
import { LoginUsuarioController } from './controllers/loginUsuario.controller';
import { AutenticacaoMiddleware } from './auth/autenticacao.middleware';
import { SessaoService } from './auth/services/sessao.service';
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "./user.module";
import { DatabaseModule } from "./database.module";
import { EmailModule } from './email.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { NotificacaoController } from './controllers/notification.controller';
import { NotificacaoModule } from './notification.module';


@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads', // Isso serve a URL /uploads/*
    }),

    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    GlobalModule,
    DatabaseModule,
    UserModule,
    EmailModule,
    NotificacaoModule,
  ],
  controllers: [CrudController, OutController, LoginUsuarioController, NotificacaoController],
  providers: [SessaoService, {
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
