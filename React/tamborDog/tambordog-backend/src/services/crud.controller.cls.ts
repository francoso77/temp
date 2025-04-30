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

  public async pesquisar({ entidade, criterio, camposLike, select }: PadraoPesquisaInterface):
    Promise<RespostaPadraoInterface<any>> {

    let where: Record<string, any> = {}
    where = { ...criterio }

    camposLike.forEach((campo) => {
      where[campo] = Like(where[campo])
    })

    return AppDataSource.getRepository(entidade)
      .find({ where: where, select: select })
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