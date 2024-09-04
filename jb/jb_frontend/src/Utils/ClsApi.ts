import axios, { AxiosRequestConfig } from "axios"
import { MensagemStateInterface, MensagemTipo } from '../ContextoGlobal/MensagemState'
import { URL_BACKEND } from './Servidor'

interface PropsInterface {
  method: 'get' | 'post' | 'put' | 'delete'
  url: string
  dados?: Record<any, any>
  mensagem?: string
  setMensagemState?: React.Dispatch<React.SetStateAction<MensagemStateInterface>>
}

export default class ClsApi {

  public async execute<T>({
    method,
    url,
    dados = {},
    setMensagemState = undefined,
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
        titulo: "Executando...",
        exibir: true,
        mensagem: mensagem,
        tipo: MensagemTipo.Warning,
        exibirBotao: false,
        cb: null
      })
    }

    return axios[method]<T>(
      URL_BACKEND.concat('/', url),
      dados,
      config
    ).then((rs) => {
      return rs.data
    })
  }
}