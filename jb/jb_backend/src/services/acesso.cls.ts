import { AppDataSource } from '../data-source'
import { GrupoPermissao } from '../entities/sistema/grupoPermissao.entity'
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
      if (rsPermissao && rsPermissao.length > 0 ) {
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
      return AppDataSource.getRepository(ModuloPermissao).save({ idModulo: idModulo, permissao: permissao }).then(moduloPermissao => {
        
        if (process.env.ID_GRUPO_ADMINISTRADOR) {
          return AppDataSource.getRepository(GrupoPermissao).save({ 
            idGrupo: parseInt(process.env.ID_GRUPO_ADMINISTRADOR), 
            idModuloPermissao: moduloPermissao.idModuloPermissao
          }).then(() => {
            return moduloPermissao.idModuloPermissao
          })
        } else {
          return moduloPermissao.idModuloPermissao
        }
      })
    }
  }

  private async pesquisarIdModulo(modulo: string): Promise<number> {
    const rsModulo = await AppDataSource.getRepository(Modulo).findOne({ where: { modulo: modulo } })
    if (rsModulo && rsModulo.idModulo) {
      return rsModulo.idModulo
    } else {
      return AppDataSource.getRepository(Modulo).save({ modulo: modulo }).then(modulo => {
        return modulo.idModulo
      })
    }
  }
}