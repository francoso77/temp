import axios, { AxiosRequestConfig } from "axios"
import { MensagemStateInterface, MensagemTipo } from '../ContextoGlobal/MensagemState'
import { URL_BACKEND } from './Servidor'

interface PropsInterface {
  method: 'get' | 'post' | 'put' | 'delete'
  url: string
  dados?: Record<any, any>
  mensagem?: string
  itemPesquisa: string,
  campo: 'data' | 'nome',
  setMensagemState?: React.Dispatch<React.SetStateAction<MensagemStateInterface>>
}

export default class ClsApi {

  public async execute<T>({
    method,
    url,
    dados = {},
    setMensagemState = undefined,
    itemPesquisa,
    campo = 'nome',
    mensagem = ""
  }: PropsInterface): Promise<T> {

    const config: AxiosRequestConfig = {
      maxBodyLength: Infinity,
      headers: {
        "Content-Type": "application/json",
      },
    }

    if (setMensagemState) {
      setMensagemState({
        titulo: mensagem,
        exibir: true,
        mensagem: '',
        tipo: MensagemTipo.Loading,
        exibirBotao: false,
        cb: null
      })
    }

    const requestData = {
      ...dados,
      itemPesquisa: itemPesquisa,
      campo: campo
    }

    return axios[method]<T>(
      URL_BACKEND.concat('/', url),
      requestData,
      config
    ).then((rs) => {
      if (rs.data && setMensagemState) {
        setMensagemState({
          titulo: '',
          exibir: false,
          mensagem: '',
          tipo: MensagemTipo.Info,
          exibirBotao: false,
          cb: null
        })
      } else if (!rs.data && setMensagemState) {
        setMensagemState({
          titulo: 'Erro...',
          exibir: true,
          mensagem: 'Erro ao pesquisar!',
          tipo: MensagemTipo.Error,
          exibirBotao: true,
          cb: null
        })
      }
      return rs.data as any
    })
}
}