import { Body, Controller, Delete, Post, Put } from '@nestjs/common';
import { RespostaPadraoInterface } from '../interfaces/respostaPadrao.interface';
import ClsCrudController from '../services/crud.controller.cls';


@Controller()
export class CrudController {
  constructor() { }

  @Post("incluirComDetalhe")
  incluirComDetalhe(
    @Body("master") master: Record<string, any>,
    @Body("detalhes") detalhes: Record<string, any>[],
    @Body("entidadeMaster") entidadeMaster: string,
    @Body("entidadeDetalhe") entidadeDetalhe: string,
    @Body("id") id: string,
  ) {
    return new ClsCrudController().incluirComDetalhe(
      master,
      entidadeMaster,
      detalhes,
      entidadeDetalhe,
      id,
    );
  }

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

  @Post("query")
  query(
    @Body("entidade:") entidade: string,
    @Body("sql") sql: string,
  ): Promise<RespostaPadraoInterface<any>> {
    return new ClsCrudController().query({
      entidade: entidade ? entidade : '',
      sql: sql ? sql : ''
    });
  }

  @Post("pesquisar")
  pesquisar(
    @Body("entidade") entidade: string,
    @Body("criterio") criterio: Record<string, any>,
    @Body("camposLike") camposLike: Array<string>,
    @Body("select") select: Array<string>,
    @Body("relations") relations: Array<string>,
  ): Promise<RespostaPadraoInterface<any>> {
    return new ClsCrudController().pesquisar({
      entidade: entidade,
      criterio: criterio,
      camposLike: camposLike ? camposLike : [],
      select: select ? select : [],
      relations: relations ? relations : [],
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

// @Post("query")
// query(
//   @Body("entidade") entidade: string,
//   @Body("criterio") criterio: Record<string, any>,
//   @Body("camposLike") camposLike: Array<string>,
//   @Body("select") select: Array<string>,
//   @Body("joins") joins: { tabelaRelacao: string, relacao: string }[],
//   @Body("sql") sql: string,
// ): Promise<RespostaPadraoInterface<any>> {
//   return new ClsCrudController().query({
//     entidade: entidade ? entidade : '',
//     criterio: criterio ? criterio : [],
//     camposLike: camposLike ? camposLike : [],
//     select: select ? select : [],
//     joins: joins,
//     sql: sql ? sql : ''
//   });
// }