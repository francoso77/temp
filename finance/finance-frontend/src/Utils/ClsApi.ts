import axios, { AxiosRequestConfig } from "axios";
import { MensagemStateInterface, MensagemTipo } from '../ContextoGlobal/MensagemState';
import { URL_BACKEND } from './Servidor';
import { GraficoType } from '../types/graficoTypes';


interface PropsInterface {
  method: 'get' | 'post' | 'put' | 'delete'
  url: string
  dados?: Record<any, any>
  mensagem?: string
  itemPesquisa?: string
  campo?: 'data' | 'nome'
  dtInicial?: string
  dtFinal?: string
  grupo?: GraficoType
  id?: number
  setMensagemState?: React.Dispatch<React.SetStateAction<MensagemStateInterface>>
  cpf?: string
  senha?: string
  operador?: string | null
  qtdComparar?: number | null
  token?: string
  conta?: string
  categoria?: string
  setor?: 'Dublagem' | 'Malharia'
  tipo?: 'Receita' | 'Despesa'
  email?: string
  newPassword?: string
}

export default class ClsApi {

  // constructor(
  //   private readonly UsuarioState: UsuarioStateInterface
  // ){
  //   console.log('token', this.UsuarioState.token)
  // }

  private static defaultConfig: AxiosRequestConfig = {
    maxBodyLength: Infinity,
    headers: {
      "Content-Type": "application/json",
    },
  };

  private static async handleResponse<T>(
    response: T,
    setMensagemState?: React.Dispatch<React.SetStateAction<MensagemStateInterface>>
  ): Promise<T> {
    if (setMensagemState) {
      setMensagemState({
        titulo: '',
        exibir: false,
        mensagem: '',
        tipo: MensagemTipo.Info,
        exibirBotao: false,
        cb: null
      });
    }
    return response;
  }

  private static async handleError(
    error: any,
    setMensagemState?: React.Dispatch<React.SetStateAction<MensagemStateInterface>>
  ): Promise<any> {
    if (setMensagemState) {
      setMensagemState({
        titulo: 'Erro...',
        exibir: true,
        mensagem: 'Erro ao processar a solicitação!',
        tipo: MensagemTipo.Error,
        exibirBotao: true,
        cb: null
      });
    }
    throw error; // Re-throw the error to allow further handling if necessary
  }

  private static async sendRequest<T>({
    method,
    url,
    dados,
    setMensagemState,
    mensagem,
    itemPesquisa,
    campo,
    dtInicial,
    dtFinal,
    grupo,
    id,
    cpf,
    senha,
    operador,
    qtdComparar,
    token,
    conta,
    categoria,
    setor,
    tipo,
    email,
    newPassword,


  }: PropsInterface): Promise<T> {
    const requestData = {
      ...dados,
      itemPesquisa,
      campo,
      dtInicial,
      dtFinal,
      grupo,
      id,
      cpf,
      senha,
      operador,
      qtdComparar,
      token,
      conta,
      categoria,
      setor,
      tipo,
      email,
      newPassword
    };

    if (setMensagemState) {
      setMensagemState({
        titulo: mensagem || '',
        exibir: true,
        mensagem: '',
        tipo: MensagemTipo.Loading,
        exibirBotao: false,
        cb: null
      });
    }

    try {

      if (token) {
        ClsApi.defaultConfig.headers = {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        }
      }
      const response = await axios[method]<T>(
        `${URL_BACKEND}/${url}`,
        requestData,
        ClsApi.defaultConfig
      );

      return await ClsApi.handleResponse(response.data, setMensagemState);
    } catch (error) {
      return await ClsApi.handleError(error, setMensagemState);
    }
  }

  public async execute<T>(props: PropsInterface): Promise<T> {
    return ClsApi.sendRequest<T>(props);
  }

  public async limpaPecas<T>(props: Omit<PropsInterface, 'itemPesquisa' | 'campo'>): Promise<T> {
    return ClsApi.sendRequest<T>(props);
  }

}
