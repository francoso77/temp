import { Module } from "@nestjs/common";
import { CrudController } from './controllers/crud.controller';

@Module({
  imports: [],
  controllers: [CrudController],
  providers: [],
})
export class AppModule { }

