import { Module } from "@nestjs/common";
import { CrudController } from './controllers/crud.controller';
import { OutController } from './controllers/out.controller';
import { LoginUsuarioController } from './controllers/loginUsuario.controller';

@Module({
  imports: [],
  controllers: [CrudController, OutController, LoginUsuarioController],
  providers: [],
})
export class AppModule { }

