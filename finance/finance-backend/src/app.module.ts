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
import { EmailModule } from './email.modulo';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';


@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Caminho absoluto para a pasta 'uploads'
      serveRoot: '/uploads', // Caminho da URL pública
    }),
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    GlobalModule,
    DatabaseModule,
    UserModule,
    EmailModule,
  ],
  controllers: [CrudController, OutController, LoginUsuarioController,],
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
