import { AppDataSource } from '../data-source';
import { Usuario } from '../entities/sistema/usuario.entity';
import { UsuarioSessao } from '../entities/sistema/usuarioSessao.entity';
import { RespostaPadraoInterface } from '../interfaces/respostaPadrao.interface';
import { v4 as uuidv4 } from 'uuid';
import { PermissoesTypeInterface, PermissoesTypes } from '../types/permissoesTypes';
import { LoginInterface } from '../interfaces/loginIterface';
import { UsuarioType } from '../types/usuarioTypes';
import { LessThan } from 'typeorm';


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

  public async logout(cpf: string): Promise<RespostaPadraoInterface<LoginInterface>> {

    return this.fecharSessoesEmAberto(cpf).then(async (rsUsuarioExistente) => {

      if (rsUsuarioExistente) {

        await AppDataSource.getRepository(Usuario).update({ cpf: cpf }, { ativo: false });
        return {
          ok: true,
          mensagem: 'Usuário deslogado com sucesso.',
          dados: {
            idUsuario: 0,
            nomeUsuario: '',
            cpfUsuario: '',
            tipoUsuario: UsuarioType.default,
            permissoes: PermissoesTypes,
            token: '',
            idVendedor: 0
          }
        };
      }
    })

  }

  public async logar(cpf: string, senha: string): Promise<RespostaPadraoInterface<LoginInterface>> {

    let retorno: RespostaPadraoInterface<LoginInterface> = {
      ok: false,
      mensagem: 'Usuário ou senha inválidos.',
      dados: {
        idUsuario: 0,
        nomeUsuario: '',
        cpfUsuario: '',
        tipoUsuario: UsuarioType.default,
        token: '',
        permissoes: PermissoesTypes,
        idVendedor: 0
      }
    }

    return this.fecharSessoesEmAberto(cpf).then((rsUsuarioExistente) => {
      if (rsUsuarioExistente) {

        return AppDataSource.getRepository(Usuario).findOne({ where: { cpf: cpf, senha: senha, tentativasLogin: LessThan(4) } }).then((rsUsuarioLogado) => {

          if (rsUsuarioLogado) {

            const token: string = uuidv4()

            return AppDataSource.getRepository(Usuario).update({ idUsuario: rsUsuarioLogado.idUsuario }, { tentativasLogin: 0 }).then(() => {

              return AppDataSource.getRepository(UsuarioSessao).save({
                idUsuario: rsUsuarioLogado.idUsuario,
                ativo: true,
                token: token
              }).then(() => {

                console.log('token gerado no login: ', token)
                return this.permissoesUsuario(rsUsuarioLogado.idUsuario).then((rsPermissoes) => {
                  return {
                    ok: true,
                    mensagem: 'Login efetuado com sucesso.',
                    dados: {
                      idUsuario: rsUsuarioLogado.idUsuario,
                      nomeUsuario: rsUsuarioLogado.nome,
                      cpfUsuario: rsUsuarioLogado.cpf,
                      tipoUsuario: rsUsuarioLogado.tipoUsuario,
                      token: token,
                      permissoes: rsPermissoes,
                      idVendedor: rsUsuarioLogado.idPessoa_vendedor
                    }
                  }
                })
              })
            })

          } else {

            return AppDataSource.getRepository(Usuario).update({ cpf: cpf }, { tentativasLogin: () => "tentativasLogin + 1" }).then(() => {
              return retorno
            })

          }

        })

      } else {
        return retorno
      }
    })

  }

  private async fecharSessoesEmAberto(cpf: string): Promise<boolean> {

    const rsUsuarioExistente = await AppDataSource.getRepository(Usuario).findOne({ where: { cpf: cpf } });
    if (rsUsuarioExistente) {

      return AppDataSource.getRepository(UsuarioSessao).update({ idUsuario: rsUsuarioExistente.idUsuario }, { ativo: false }).then(() => {
        return true;
      });

    } else {

      return false;

    }
  }

  public async updatePermissoesUsuario(idUsuario: number): Promise<PermissoesTypeInterface> {

    return AppDataSource.query<Array<rsSqlPermissaoPorUsuario>>(SQL_PERMISSAO_POR_USUARIO, [idUsuario, idUsuario]).then((rsPermissoes) => {

      console.log(rsPermissoes)

      let retorno = JSON.parse(JSON.stringify(PermissoesTypes))

      Object.keys(PermissoesTypes).forEach((keyModulo) => {

        const modulo = PermissoesTypes[keyModulo].MODULO;

        Object.keys(PermissoesTypes[keyModulo].PERMISSOES).forEach((keyPermissao) => {

          const permissao = PermissoesTypes[keyModulo].PERMISSOES[keyPermissao];

          //console.log(modulo, permissao);

          if (rsPermissoes.findIndex((rs) => rs.modulo === modulo && rs.permissao === permissao) < 0) {
            retorno[keyModulo].PERMISSOES[keyPermissao] = ''
          }

        })
      })
      return retorno
    })
  }

  private async permissoesUsuario(idUsuario: number): Promise<PermissoesTypeInterface> {

    const rsPermissoes = await AppDataSource.query<Array<rsSqlPermissaoPorUsuario>>(SQL_PERMISSAO_POR_USUARIO, [idUsuario, idUsuario]);
    let retorno = JSON.parse(JSON.stringify(PermissoesTypes));
    Object.keys(PermissoesTypes).forEach((keyModulo) => {

      const modulo = PermissoesTypes[keyModulo].MODULO;

      Object.keys(PermissoesTypes[keyModulo].PERMISSOES).forEach((keyPermissao) => {

        const permissao = PermissoesTypes[keyModulo].PERMISSOES[keyPermissao];

        console.log(modulo, permissao);

        if (rsPermissoes.findIndex((rs) => rs.modulo === modulo && rs.permissao === permissao) < 0) {
          retorno[keyModulo].PERMISSOES[keyPermissao] = '';
        }

      });

    });
    console.log('permissoes encontradas pela pesquisa', rsPermissoes);
    console.log('retorno obtido do teste', retorno);
    return retorno;

    /** 
    const fechouSessoes = await this.fecharSessoesEmAberto(cpf)
    if (!fechouSessoes) {
      return retorno
    }

    const usuarioLogado = await AppDataSource.getRepository(Usuario)
      .createQueryBuilder('usuario')
      .where('usuario.cpf = :cpf AND usuario.senha = :senha AND usuario.tentativasLogin < 4', { cpf, senha })
      .getOne()

    if (usuarioLogado) {

      console.log("usuario logado", usuarioLogado)
      const token: string = uuidv4()

      await AppDataSource.getRepository(Usuario)
        .update({ idUsuario: usuarioLogado.idUsuario }, { tentativasLogin: 0 })

      await AppDataSource.getRepository(UsuarioSessao)
        .save({
          idUsuario: usuarioLogado.idUsuario,
          token,
          ativo: true,
          tipoUsuario: usuarioLogado.tipoUsuario
        }).then(async () => {

          const rsPermissoes = await this.permissoesUsuario(usuarioLogado.idUsuario);
          return {
            ok: true,
            mensagem: 'Login efetuado com sucesso.',
            dados: {
              idUsuario: usuarioLogado.idUsuario,
              nomeUsuario: usuarioLogado.nome,
              tipoUsuario: usuarioLogado.tipoUsuario,
              token: token,
              permissoes: rsPermissoes
            }
          };
        })
      // retorno.ok = true
      // retorno.mensagem = 'Login efetuado com sucesso.'
      // retorno.dados = usuarioLogado.nome +
      //   '.' + token +
      //   '.' + usuarioLogado.tipoUsuario +
      //   '.' + usuarioLogado.idUsuario
      // return retorno
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
   */
  }

}