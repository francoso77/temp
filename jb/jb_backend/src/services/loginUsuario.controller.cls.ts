import { AppDataSource } from '../data-source';
import { Usuario } from '../entities/sistema/usuario.entity';
import { UsuarioSessao } from '../entities/sistema/usuarioSessao.entity';
import { RespostaPadraoInterface } from '../interfaces/respostaPadrao.interface';
import { v4 as uuidv4 } from 'uuid';

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
      retorno.dados = usuarioLogado.nome + '.' + token + '.' + usuarioLogado.tipoUsuario
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

}