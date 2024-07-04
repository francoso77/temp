import { Like } from 'typeorm';
import { AppDataSource } from '../data-source';
import { PadraoPesquisaInterface, RespostaPadraoInterface } from '../interfaces/respostaPadrao.interface';

export default class ClsCrudController {

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
        console.log(rs)
        return {
          ok: true,
          mensagem: 'Pesquisa Concluída',
          dados: rs
        }
      })
  }

  public async pesquisar({ entidade, criterio, camposLike, select }: PadraoPesquisaInterface):
    Promise<RespostaPadraoInterface<any>> {

    let where: Record<string, any> = {}
    where = { ...criterio }

    camposLike.forEach((campo) => {
      where[campo] = Like(where[campo])
    })

    return AppDataSource.getRepository(entidade)
      .find({
        where: where,
        select: select
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
}