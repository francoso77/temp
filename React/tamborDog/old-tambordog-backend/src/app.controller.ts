import { Controller, Delete, Get, Put, Query } from '@nestjs/common';
import Categoria from './entity/Categoria';
import { AppDataSource } from './data-source';
//import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor() { } //private readonly appService: AppService

  // @Get('/categoria')
  // getCategoria(): Promise<Categoria[]> {
  //   return AppDataSource.getRepository(Categoria).find()
  // }

  @Get('/categoria')
  getCategoria(@Query('descricao') descricao: string): Promise<Categoria[]> {
    return AppDataSource.getRepository(Categoria).find({
      where: { nome: descricao }
    })
  }

  @Put('/categoria')
  putCategoria(): string {
    return 'put categoria'
  }

  @Delete('/categoria')
  delCategoria(): string {
    return 'delete categoria'
  }

}