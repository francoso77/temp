import { Module } from "@nestjs/common";
import { CrudController } from './controllers/crud.controller';
import { OutController } from './controllers/out.controller';

@Module({
  imports: [],
  controllers: [CrudController, OutController],
  providers: [],
})
export class AppModule { }

