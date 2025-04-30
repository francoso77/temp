import { Body, Controller, Delete, Post, Put } from '@nestjs/common';
import { RespostaPadraoInterface } from '../interfaces/respostaPadrao.interface';
import ClsCrudController from '../services/crud.controller.cls';


@Controller()
export class CrudController {
  constructor() { }

  @Post("incluir")
  incluir(
    @Body("criterio") criterio: Record<string, any>,
    @Body("entidade") entidade: string
  ): Promise<RespostaPadraoInterface<any>> {
    return new ClsCrudController().incluir(criterio, entidade);
  }

  @Put("atualizar")
  atualizar(
    @Body("criterio") criterio: Record<string, any>,
    @Body("entidade:") entidade: string
  ): Promise<RespostaPadraoInterface<any>> {
    return new ClsCrudController().incluir(criterio, entidade)
  }

  @Post("pesquisar")
  pesquisar(
    @Body("entidade") entidade: string,
    @Body("criterio") criterio: Record<string, any>,
    @Body("camposLike") camposLike: Array<string>,
    @Body("select") select: Array<string>
  ): Promise<RespostaPadraoInterface<any>> {
    return new ClsCrudController().pesquisar({
      entidade: entidade,
      criterio: criterio,
      camposLike: camposLike ? camposLike : [],
      select: select ? select : [],
    });
  }

  @Delete("excluir")
  excluir(
    @Body("entidade") entidade: string,
    @Body("criterio") criterio: Record<string, any>,
  ): Promise<RespostaPadraoInterface<any>> {
    return new ClsCrudController().excluir(criterio, entidade);
  }

}