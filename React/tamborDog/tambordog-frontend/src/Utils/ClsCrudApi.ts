import {
  PadraoPesquisaInterface,
  RespostaPadraoInterface,
} from "../../../tambordog-backend/src/interfaces/respostaPadrao.interface"
import axios, { AxiosRequestConfig } from "axios"
import { MensagemStateInterface, MensagemTipo } from '../ContextoGlobal/MensagemState'
import { actionTypes } from '../Interfaces/ActionInterface'

export interface PropsInterface extends PadraoPesquisaInterface {
  localState?: actionTypes | undefined,
  msg?: string,
  cb?: null | ((res: boolean) => void),
  setMensagemState?: React.Dispatch<React.SetStateAction<MensagemStateInterface>>
}

interface cepInterface {
  CEP: string,
  setMensagemState: React.Dispatch<React.SetStateAction<MensagemStateInterface>>
}
interface dadosCepInterface {
  cep: string,
  logradouro: string,
  bairro: string,
  localidade: string,
  uf: string,
  tem: boolean
}

export default class ClsCrud {

  public pesquisar({
    entidade,
    criterio,
    camposLike,
    select,
    msg = 'Pesquisando...',
    cb,
    setMensagemState
  }: PropsInterface): Promise<Array<any>> {
    const dados: PadraoPesquisaInterface = {
      entidade: entidade,
      criterio: criterio,
      camposLike: camposLike,
      select: select
    }

    const config: AxiosRequestConfig = {
      maxBodyLength: Infinity,
      headers: {
        "Content-Type": "application/json",
      },
    }

    if (setMensagemState) {
      setMensagemState({
        titulo: msg,
        exibir: true,
        mensagem: '',
        tipo: MensagemTipo.Loading,
        exibirBotao: false,
        cb: null
      })
    }
    return axios
      .post<RespostaPadraoInterface<Array<any>>>(
        "http://localhost:4000/pesquisar",
        dados,
        config
      )
      .then((rs) => {
        if (rs.data.ok && setMensagemState) {
          setMensagemState({
            titulo: '',
            exibir: false,
            mensagem: '',
            tipo: MensagemTipo.Info,
            exibirBotao: false,
            cb: null
          })
        } else if (!rs.data.ok && setMensagemState) {
          setMensagemState({
            titulo: 'Erro...',
            exibir: true,
            mensagem: 'Erro ao pesquisar!',
            tipo: MensagemTipo.Error,
            exibirBotao: true,
            cb: null
          })
        }
        return rs.data.dados as any
      })
  }

  public incluir({
    entidade,
    criterio,
    localState,
    cb,
    setMensagemState
  }: PropsInterface): Promise<RespostaPadraoInterface<any>> {
    const dados: PadraoPesquisaInterface = {
      entidade: entidade,
      criterio: criterio,
    }

    const config: AxiosRequestConfig = {
      maxBodyLength: Infinity,
      headers: {
        "Content-Type": "application/json",
      },
    }
    if (setMensagemState) {
      setMensagemState({
        titulo: '',
        exibir: true,
        mensagem: localState === actionTypes.incluindo ? 'Incluindo...' : 'Alterando...',
        tipo: MensagemTipo.Info,
        exibirBotao: false,
        cb: null
      })
    }
    return axios
      .post<RespostaPadraoInterface<Array<any>>>(
        "http://localhost:4000/incluir",
        dados,
        config
      )
      .then((rs) => {
        if (rs.data.ok && setMensagemState) {
          setMensagemState({
            titulo: 'Cadastro...',
            exibir: true,
            mensagem: localState === actionTypes.incluindo ? 'Inclusão realizada!' : 'Alteração realizada!',
            tipo: localState === actionTypes.incluindo ? MensagemTipo.Ok : MensagemTipo.Info,
            exibirBotao: true,
            cb: cb ? cb : null
          })
        } else if (!rs.data.ok && setMensagemState) {
          setMensagemState({
            titulo: 'Erro...',
            exibir: true,
            mensagem: localState === actionTypes.incluindo ? 'Erro ao incluir!' : 'Erro ao alterar!',
            tipo: MensagemTipo.Error,
            exibirBotao: true,
            cb: null
          })
        }
        return rs.data
      })
  }

  public excluir({
    entidade,
    criterio,
    cb,
    setMensagemState
  }: PropsInterface): Promise<RespostaPadraoInterface<any>> {
    const dados: PadraoPesquisaInterface = {
      entidade: entidade,
      criterio: criterio,
    }

    const config = {
      maxBodyLength: Infinity,
      headers: {
        "Content-Type": "application/json",
      },
      data: dados
    }
    if (setMensagemState) {
      setMensagemState({
        titulo: '',
        exibir: true,
        mensagem: 'Excluindo...',
        tipo: MensagemTipo.Info,
        exibirBotao: false,
        cb: null
      })
    }

    return axios
      .delete<RespostaPadraoInterface<Array<any>>>(
        "http://localhost:4000/excluir",
        config
      )
      .then((rs) => {
        if (rs.data.ok && setMensagemState) {
          setMensagemState({
            titulo: 'Cadastro...',
            exibir: true,
            mensagem: 'Exclusão realizada!',
            tipo: MensagemTipo.Ok,
            exibirBotao: true,
            cb: cb ? cb : null
          })
        } else if (!rs.data.ok && setMensagemState) {
          setMensagemState({
            titulo: 'Erro...',
            exibir: true,
            mensagem: 'Erro ao excluir!',
            tipo: MensagemTipo.Error,
            exibirBotao: true,
            cb: null
          })
        }
        return rs.data
      })
  }

  public tmp_eCEP: dadosCepInterface = {
    cep: '',
    logradouro: '',
    bairro: '',
    localidade: '',
    uf: '',
    tem: false
  }

  public verificaCEP({
    CEP,
    setMensagemState
  }: cepInterface): Promise<Boolean> {

    CEP = CEP.replace(/-|\./g, '')

    const tmpURL = 'https://viacep.com.br/ws/'.concat(CEP).concat('/json/')

    if (setMensagemState) {
      setMensagemState({
        titulo: 'Processando...',
        mensagem: 'Recebendo dados do CEP...',
        exibir: true,
        tipo: MensagemTipo.Loading,
        exibirBotao: false,
        cb: null
      })
    }
    return axios.get(tmpURL)

      .then((dados) => {
        if (dados.statusText === 'OK') {
          if (!dados.data.erro) {
            this.tmp_eCEP.cep = dados.data.cep
            this.tmp_eCEP.bairro = dados.data.bairro
            this.tmp_eCEP.logradouro = dados.data.logradouro
            this.tmp_eCEP.localidade = dados.data.localidade
            this.tmp_eCEP.uf = dados.data.uf
            this.tmp_eCEP.tem = true

            setMensagemState({
              titulo: '',
              exibir: false,
              mensagem: '',
              tipo: MensagemTipo.Ok,
              exibirBotao: false,
              cb: null
            })

            return true

          } else {
            setMensagemState({
              titulo: 'Erro...',
              exibir: true,
              mensagem: 'CEP não encontrado!',
              tipo: MensagemTipo.Error,
              exibirBotao: true,
              cb: null
            })
            return false
          }
        } else {
          return false
        }
      })
  }
}
