import { useState } from "react"
import { AlertColor } from '@mui/material'

export enum MensagemTipo {
  Warning = 'warning',
  Error = 'error',
  Info = 'info',
  Ok = 'success',
  Loading = 'Loading'
}

export interface MensagemStateInterface {
  exibir: boolean
  mensagem: string
  titulo: string
  tipo: AlertColor | 'Loading'
  exibirBotao: boolean | 'SN' | string
  cb: null | ((res: boolean) => void)
}

export const mensagemPadrao: MensagemStateInterface = {
  exibir: false,
  mensagem: '',
  titulo: '',
  tipo: MensagemTipo.Info,
  exibirBotao: false,
  cb: () => { }
}
export default function useMensagemState() {
  const [mensagemState, setMensagemState] = useState<MensagemStateInterface>(mensagemPadrao)

  return { mensagemState, setMensagemState }
}