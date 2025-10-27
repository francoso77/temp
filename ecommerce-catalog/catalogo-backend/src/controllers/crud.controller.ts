import { BadRequestException, Body, Controller, Delete, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { RespostaPadraoInterface } from '../interfaces/respostaPadrao.interface';
import ClsCrudController from '../services/crud.controller.cls';
import { Roles } from '../auth/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
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
  @Roles()
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
    @Body("comparador") comparador: "N" | "L" | "I" | "=" | ">" | "<" | ">=" | "<=",
    @Body("tipoOrder") tipoOrder: "ASC" | "DESC",
  ): Promise<RespostaPadraoInterface<any>> {
    return new ClsCrudController().pesquisar({
      entidade: entidade,
      criterio: criterio,
      camposLike: camposLike ? camposLike : [],
      select: select ? select : [],
      relations: relations ? relations : [],
      campoOrder: campoOrder ? campoOrder : [],
      comparador: comparador ? comparador : "L",
      tipoOrder: tipoOrder ? tipoOrder : "ASC"
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
    @Body("comparador") comparador: "N" | "L" | "I" | "=" | ">" | "<" | ">=" | "<=",
    @Body("tipoOrder") tipoOrder: "ASC" | "DESC",
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
      comparador: comparador ? comparador : "L",
      tipoOrder: tipoOrder ? tipoOrder : "ASC",
      groupBy: groupBy ? groupBy : '',
      having: having ? having : '',
    });
  }

  @Post('upload-produto')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(__dirname, '..', '..', 'uploads', 'produtos'),
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadProduto(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado.');
    }

    // ✅ Apenas retorna o nome do arquivo
    return {
      ok: true,
      filename: file.filename,
      caminho: `/uploads/produtos/${file.filename}`,
    };
  }



  //   @Patch(':id')
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: diskStorage({
  //       destination: join(__dirname, '..', '..', 'uploads', 'produtos'), // Caminho corrigido
  //       filename: (req, file, cb) => {
  //         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  //         cb(null, uniqueSuffix + extname(file.originalname));
  //       },
  //     }),
  //   }),
  // )
  // async updateProduto(
  //   //@Param('id') id: string,
  //   @UploadedFile() file: Express.Multer.File,
  //   @Body() body: any, // usa `any` pois os campos do `FormData` chegam como strings
  // ) {
  //   const updatedData = {
  //     ...body,
  //     imagem: file?.filename ?? body.imagem ?? null,
  //   };

  //   const produtoAlterado = await AppDataSource.getRepository('Produto').findOne({ where: { id } });
  //   return this.userService.updateUser(id, updatedData);
  // }
}
