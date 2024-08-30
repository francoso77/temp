import { Body, Controller, Delete, Post, Put } from '@nestjs/common';
import { RespostaPadraoInterface } from '../interfaces/respostaPadrao.interface';
import ClsCrudController from '../services/crud.controller.cls';
import { join } from 'path';


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
    @Body("campoOrder") campoOrder: Array<any>,
    @Body("notOrLike") notOrLike: "N" | "L",
  ): Promise<RespostaPadraoInterface<any>> {
    return new ClsCrudController().pesquisar({
      entidade: entidade,
      criterio: criterio,
      camposLike: camposLike ? camposLike : [],
      select: select ? select : [],
      relations: relations ? relations : [],
      campoOrder: campoOrder ? campoOrder : [],
      notOrLike: notOrLike ? notOrLike : "L",
    });
  }

  @Delete("excluir")
  excluir(
    @Body("entidade") entidade: string,
    @Body("criterio") criterio: Record<string, any>,
  ): Promise<RespostaPadraoInterface<any>> {
    return new ClsCrudController().excluir(criterio, entidade);
  }

  @Post("consultar")
  consultar(
    @Body("entidade") entidade: string,
    @Body("joins") joins: { tabelaRelacao: string, relacao: string }[],
    @Body("criterio") criterio: Record<string, any>,
    @Body("camposLike") camposLike: Array<string>,
    @Body("select") select: Array<string>,
    @Body("campoOrder") campoOrder: Array<any>,
    @Body("notOrLike") notOrLike: "N" | "L" | "I",
    @Body("groupBy") groupBy: string,
    @Body("having") having: string,
  ): Promise<RespostaPadraoInterface<any>> {

    return new ClsCrudController().consultar({
      entidade: entidade,
      joins: joins ? joins : [],
      criterio: criterio,
      camposLike: camposLike ? camposLike : [],
      select: select ? select : [],
      campoOrder: campoOrder ? campoOrder : [],
      notOrLike: notOrLike ? notOrLike : "L",
      groupBy: groupBy ? groupBy : '',
      having: having ? having : '',
    });
  }
}
