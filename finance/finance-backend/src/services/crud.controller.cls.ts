import { In, LessThan, LessThanOrEqual, Like, MoreThan, MoreThanOrEqual, Not } from 'typeorm';
import { AppDataSource } from '../data-source';
import { PadraoPesquisaInterface, RespostaPadraoInterface } from '../interfaces/respostaPadrao.interface';

export default class ClsCrudController {

  public async incluirComDetalhe(
    master: Record<string, any>,
    entidadeMaster: string,
    detalhes: Record<string, any>[],
    entidadeDetalhe: string,
    id: string
  ) {

    return AppDataSource.transaction(async entity => {
      const newMaster = entity.save(entidadeMaster, master)
      detalhes.forEach(detalhe => detalhe[id] = newMaster[id])
      entity.save(entidadeDetalhe, detalhes)
    })
      .then((rs) => {
        return {
          ok: true,
          mensagem: "Registro salvo com Sucesso.",
          dados: rs,
        };
      })
      .catch((e) => {
        return {
          ok: false,
          mensagem: e.message,
        };
      })
  }

  public async incluir(criterio: Record<string, any>, entidade: string) {
    return AppDataSource.getRepository(entidade)
      .save(criterio)
      .then((rs) => {
        return {
          ok: true,
          mensagem: "Registro Salvo com sucesso.",
          dados: rs,
        };
      })
      .catch((e) => {
        return {
          ok: false,
          mensagem: e.message,
        };
      });
  }

  public async query({ entidade, sql }: PadraoPesquisaInterface):
    Promise<RespostaPadraoInterface<any>> {
    const repositorio = AppDataSource.getRepository(entidade)

    // let where: Record<string, any> = {}
    // where = { ...criterio }

    // camposLike.forEach((campo) => {
    //   where[campo] = Like(where[campo])
    // })

    // console.log("where: ", where)
    // const rep = AppDataSource.getRepository(entidade)
    // const repository = AppDataSource.getRepository(entidade)
    // let queryBuilder = repository.createQueryBuilder(entidade.toLowerCase())

    // joins.forEach(join => {
    //   queryBuilder = queryBuilder.leftJoinAndSelect(join.tabelaRelacao, join.relacao)
    // })

    // queryBuilder = queryBuilder
    //   .select(select)
    //   .where(where)

    // const query = `
    //   SELECT 
    //       e.*,
    //       p.nome AS nomeProduto,
    //       tp.nome AS nomeTipoProduto
    //   FROM 
    //       estruturas e
    //   INNER JOIN 
    //       produtos p ON e.idProduto = p.idProduto
    //   INNER JOIN 
    //       tipoprodutos tp ON p.idTipoProduto = tp.idTipoProduto
    //   WHERE 
    //       p.nome LIKE '%%';
    //   `;

    return repositorio.query(sql)
      .then((rs) => {
        return {
          ok: true,
          mensagem: 'Pesquisa Concluída',
          dados: rs
        }
      })
  }

  public async pesquisar({ entidade, criterio, camposLike, select, relations = [], campoOrder, comparador, tipoOrder }: PadraoPesquisaInterface):
    Promise<RespostaPadraoInterface<any>> {

    let where: Record<string, any> = {}
    where = { ...criterio }

    //"N" | "L" | "I" | "=" | ">" | "<" | ">=" | "<=" | "!=" 

    camposLike.forEach((campo) => {
      if (comparador === "L") {
        where[campo] = Like(where[campo])
      } else if (comparador === "N") {
        where[campo] = Not(where[campo])
      } else if (comparador === "I") {
        where[campo] = In(where[campo])
      } else if (comparador === "=") {
        where[campo] = (where[campo])
      } else if (comparador === ">") {
        where[campo] = MoreThan(where[campo])
      } else if (comparador === ">=") {
        where[campo] = MoreThanOrEqual(where[campo])
      } else if (comparador === "<") {
        where[campo] = LessThan(where[campo])
      } else if (comparador === "<=") {
        where[campo] = LessThanOrEqual(where[campo])
      }
    })

    let order: Record<string, any> = {}
    campoOrder.forEach((campo) => {
      order[campo] = tipoOrder
    })

    return AppDataSource.getRepository(entidade)
      .find({
        where: where,
        select: select,
        relations: relations,
        order: order
      })
      .then((rs) => {
        return {
          ok: true,
          mensagem: 'Pesquisa Concluída',
          dados: rs
        }
      })
  }

  public async excluir(criterio: Record<string, any>, entidade: string) {
    return AppDataSource.getRepository(entidade).delete(criterio)
      .then((rs) => {
        if (rs.affected === 0) {
          return {
            ok: true,
            mensagem: "Registro não encontrado.",
            dados: rs,
          };
        }
        return {
          ok: true,
          mensagem: "Registro Deletado.",
          dados: rs,
        };
      })
      .catch((e) => {
        return {
          ok: false,
          mensagem: e.message,
        };
      });
  }

  public async consultar({
    entidade,
    joins,
    criterio,
    camposLike,
    select,
    campoOrder,
    comparador,
    groupBy,
    having,
    tipoOrder
  }: PadraoPesquisaInterface): Promise<RespostaPadraoInterface<any>> {

    try {

      let where: Record<string, any> = {}
      where = { ...criterio }

      camposLike.forEach((campo) => {
        if (comparador === "L") {
          where[campo] = Like(where[campo])
        } else if (comparador === "N") {
          where[campo] = Not(where[campo])
        } else {
          where[campo] = In(where[campo])
        }
      })

      let order: Record<string, any> = {}
      campoOrder.forEach((campo) => {
        order[campo] = tipoOrder
      })

      // console.log('entidade:', entidade)
      // console.log('joins:', joins)
      // console.log('groupBy:', groupBy)
      // console.log('having:', having)
      // console.log("where: ", where)

      const repository = AppDataSource.getRepository(entidade)
      let queryBuilder = repository.createQueryBuilder(entidade.toLowerCase())

      joins.forEach(join => {
        queryBuilder = queryBuilder.leftJoinAndSelect(join.tabelaRelacao, join.relacao)
      })

      queryBuilder = queryBuilder
        .select(select)
        .where(where)
        .groupBy(groupBy)
        .having(having)
        .orderBy(order)

      //Adiciona a cláusula WHERE para os campos LIKE
      // camposLike.forEach((campo) => {
      //   const nomeCampo = `${criterio}`;
      //   if (comparador === "L") {
      //     queryBuilder = queryBuilder.andWhere(`${nomeCampo} LIKE :${campo}`, { [campo]: `%${criterio[campo]}%` });
      //   } else if (comparador === "N") {
      //     queryBuilder = queryBuilder.andWhere(`${nomeCampo} NOT LIKE :${campo}`, { [campo]: `%${criterio[campo]}%` });
      //   } else {
      //     queryBuilder = queryBuilder.andWhere(`${nomeCampo} IN (:...${campo})`, { [campo]: criterio[campo] });
      //   }
      // });

      const resultado = await queryBuilder.getRawMany()
      return {
        ok: true,
        mensagem: 'Pesquisa Concluída',
        dados: resultado
      }

    } catch (error) {
      console.error("Erro na consulta: ", error);
      return {
        ok: false,
        mensagem: 'Erro na pesquisa',
        dados: null
      }

    }
  }


}
