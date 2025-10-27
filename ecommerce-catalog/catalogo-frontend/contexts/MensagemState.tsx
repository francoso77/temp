import { AlertColorType } from '@/app/types/AlertColorType'
import { useState } from "react"

export interface MensagemStateInterface {
  exibir: boolean
  mensagem: string
  titulo: string
  tipo: AlertColorType
  exibirBotao: boolean | 'SN' | string
  cb: null | ((res: boolean) => void)
}

export const mensagemPadrao: MensagemStateInterface = {
  exibir: false,
  mensagem: '',
  titulo: '',
  tipo: 'info',
  exibirBotao: false,
  cb: () => { }
}
export default function useMensagemState() {
  const [mensagemState, setMensagemState] = useState<MensagemStateInterface>(mensagemPadrao)

  return { mensagemState, setMensagemState }
}