import { AppDataSource } from '../data-source'
import { Modulo } from '../entities/sistema/modulo.entity'
import { ModuloPermissao } from '../entities/sistema/moduloPermissao.entity'

const SQL_PERMISSAO: string = `
    SELECT grpe.idModuloPermissao FROM gruposusuarios AS grus
    INNER JOIN grupospermissoes AS grpe
    ON grus.idGrupo = grpe.idGrupo
    WHERE grus.idUsuario = ? AND grpe.idModuloPermissao = ?
    UNION ALL
    SELECT uspe.idModuloPermissao FROM usuariospermissoes AS uspe
    WHERE uspe.idUsuario = ? AND uspe.idModuloPermissao = ?;
`

export default class ClsAcesso {
  public async checarAcesso(idUsuario: number, modulo: string, permissao: string): Promise<boolean> {

    if (idUsuario && idUsuario > 0) {

      const idModuloPermissao = await this.pesquisarIdModuloPermissao(modulo, permissao)
      const rsPermissao = await AppDataSource.query(SQL_PERMISSAO, [idUsuario, idModuloPermissao, idUsuario, idModuloPermissao])
      if (rsPermissao && rsPermissao.length > 0) {
        return true
      } else {
        return false
      }

    } else {
      return Promise.resolve(false)
    }
  }

  private async pesquisarIdModuloPermissao(modulo: string, permissao: string): Promise<number> {

    const idModulo = await this.pesquisarIdModulo(modulo)
    const rsModuloPermissao = await AppDataSource.getRepository(ModuloPermissao).findOne({ where: { idModulo: idModulo, permissao: permissao } })
    if (rsModuloPermissao && rsModuloPermissao.idModuloPermissao) {
      return rsModuloPermissao.idModuloPermissao
    } else {
      return AppDataSource.getRepository(ModuloPermissao).save({ idModulo: idModulo, permissao: permissao }).then(rsModuloPermissao_1 => {
        return rsModuloPermissao_1.idModuloPermissao
      })
    }
  }

  private async pesquisarIdModulo(modulo: string): Promise<number> {
    const rsModulo = await AppDataSource.getRepository(Modulo).findOne({ where: { modulo: modulo } })
    if (rsModulo && rsModulo.idModulo) {
      return rsModulo.idModulo
    } else {
      return AppDataSource.getRepository(Modulo).save({ modulo: modulo }).then(rsModulo_1 => {
        return rsModulo_1.idModulo
      })
    }
  }
}