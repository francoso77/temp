import { AppDataSource } from '../data-source'
import { UsuarioSessao } from '../entities/sistema/usuarioSessao.entity'

export default class ClsAutenticacaoMiddleware {

  public async pesquisarToken(authorization: string): Promise<number> {

    let token: string = authorization ? authorization : ''

    if (token.length > 0) {

      token = token.replace('Bearer ', '')

      return await AppDataSource.getRepository(UsuarioSessao)
        .findOne({ where: { token: token, ativo: true } })
        .then(rsUsuarioSessao => {

          if (rsUsuarioSessao) {
            return rsUsuarioSessao.idUsuario

          } else {
            return 0

          }
        })

    } else {
      return await Promise.resolve(0)
    }

  }
}