import { AppDataSource } from '../data-source';
import { Usuario } from '../entities/sistema/usuario.entity';
import { UsuarioSessao } from '../entities/sistema/usuarioSessao.entity';
import { RespostaPadraoInterface } from '../interfaces/respostaPadrao.interface';
import { v4 as uuidv4 } from 'uuid';
import { PermissoesTypeInterface, PermissoesTypes } from '../types/permissoesTypes';


interface rsSqlPermissaoPorUsuario {
  modulo: string
  permissao: string
}

const SQL_PERMISSAO_POR_USUARIO = `
    SELECT m.modulo, mp.permissao FROM modulospermissoes AS mp 

    INNER JOIN modulos AS m
    ON mp.idModulo = m.idModulo

    INNER JOIN 
    (
    SELECT grpe.idModuloPermissao FROM gruposusuarios AS grus
    INNER JOIN grupospermissoes AS grpe
    ON grus.idGrupo = grpe.idGrupo
    WHERE grus.idUsuario = ?
    UNION ALL
    SELECT uspe.idModuloPermissao FROM usuariospermissoes AS uspe
    WHERE uspe.idUsuario = ?
    ) AS permissoes
    ON mp.idModuloPermissao = permissoes.idModuloPermissao
`

export default class ClsLoginUsuarioController {
  public async logar(cpf: string, senha: string): Promise<RespostaPadraoInterface<string>> {

    const retorno: RespostaPadraoInterface<string> = {
      ok: false,
      mensagem: 'Usuário ou senha inválidos.',
      dados: null
    }

    const fechouSessoes = await this.fecharSessoesEmAberto(cpf)
    if (!fechouSessoes) {
      return retorno
    }

    const usuarioLogado = await AppDataSource.getRepository(Usuario)
      .createQueryBuilder('usuario')
      .where('usuario.cpf = :cpf AND usuario.senha = :senha AND usuario.tentativasLogin < 4', { cpf, senha })
      .getOne()

    if (usuarioLogado) {

      const token: string = uuidv4()

      await AppDataSource.getRepository(Usuario)
        .update({ idUsuario: usuarioLogado.idUsuario }, { tentativasLogin: 0 })

      await AppDataSource.getRepository(UsuarioSessao)
        .save({
          idUsuario: usuarioLogado.idUsuario,
          token,
          ativo: true,
          tipoUsuario: usuarioLogado.tipoUsuario
        })

      retorno.ok = true
      retorno.mensagem = 'Login efetuado com sucesso.'
      retorno.dados = usuarioLogado.nome +
        '.' + token +
        '.' + usuarioLogado.tipoUsuario +
        '.' + usuarioLogado.idUsuario
      return retorno
    } else {
      await AppDataSource.getRepository(Usuario)
        .update({ cpf }, { tentativasLogin: () => 'tentativasLogin + 1' })
      return retorno
    }
  }
  private async fecharSessoesEmAberto(cpf: string): Promise<boolean> {
    const usuarioExistente = await AppDataSource.getRepository(Usuario)
      .createQueryBuilder("usuario")
      .where("usuario.cpf = :cpf", { cpf })
      .getOne()

    if (usuarioExistente) {
      await AppDataSource.getRepository(UsuarioSessao)
        .update(
          { idUsuario: usuarioExistente.idUsuario },
          { ativo: false }
        )

      return true
    } else {

      return false
    }
  }

  public async permissoesUsuario(idUsuario: number): Promise<PermissoesTypeInterface> {

    return AppDataSource.query<Array<rsSqlPermissaoPorUsuario>>(SQL_PERMISSAO_POR_USUARIO, [idUsuario, idUsuario]).then((rsPermissoes) => {

      let retorno = JSON.parse(JSON.stringify(PermissoesTypes))

      Object.keys(PermissoesTypes).forEach((keyModulo) => {

        const modulo = PermissoesTypes[keyModulo].MODULO;

        Object.keys(PermissoesTypes[keyModulo].PERMISSOES).forEach((keyPermissao) => {

          const permissao = PermissoesTypes[keyModulo].PERMISSOES[keyPermissao];

          console.log(modulo, permissao);

          if (rsPermissoes.findIndex((rs) => rs.modulo === modulo && rs.permissao === permissao) < 0) {
            retorno[keyModulo].PERMISSOES[keyPermissao] = ''
          }

        })

      })

      return retorno
    })

  }
}