import { AppDataSource } from '../data-source'
import { UserSection } from '../entity/sistema/userSection'

export default class ClsAutenticacaoMiddleware {

  public async pesquisarToken(authorization: string): Promise<string | number> {

    let token: string = authorization ? authorization : ''

    if (token.length > 0) {

      token = token.replace('Bearer ', '')

      return await AppDataSource.getRepository(UserSection)
        .findOne({ where: { token: token, isActive: true } })
        .then(rsUsuarioSessao => {

          if (rsUsuarioSessao) {
            return rsUsuarioSessao.id

          } else {
            return 0

          }
        })

    } else {
      return await Promise.resolve(0)
    }

  }
}