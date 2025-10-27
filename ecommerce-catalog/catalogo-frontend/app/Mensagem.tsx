"use client"

import Condicional from "@/components/Condicional/Condicional"

import {
  AlertTriangle,
  XCircle,
  Info,
  CheckCircle,
  Loader2,
} from "lucide-react"
import { useAuth } from '@/contexts/AuthContext'

const iconMap = {
  warning: { Icon: AlertTriangle, color: "text-yellow-500 bg-yellow-50 border-yellow-300" },
  error: { Icon: XCircle, color: "text-red-500 bg-red-50 border-red-300" },
  info: { Icon: Info, color: "text-blue-500 bg-blue-50 border-blue-300" },
  success: { Icon: CheckCircle, color: "text-green-500 bg-green-50 border-green-300" },
  // Removido 'animate-spin' daqui:
  loading: { Icon: Loader2, color: "text-gray-500 bg-gray-50 border-gray-300" },
}
export default function Mensagem() {
  const { mensagemState, setMensagemState } = useAuth()

  const btResposta = (resposta: boolean) => {
    if (mensagemState.cb) {
      fecharJanela()
      mensagemState.cb(resposta)
    }
  }

  const fecharJanela = () => {
    setMensagemState({ ...mensagemState, exibir: false })
    if (mensagemState.cb) {
      mensagemState.cb(true)
    }
  }

  const exibirBotao = (): boolean =>
    (typeof mensagemState.exibirBotao === "boolean" && mensagemState.exibirBotao) ||
    (typeof mensagemState.exibirBotao === "string" && mensagemState.exibirBotao.length > 0)

  const textoBotao = (): string =>
    typeof mensagemState.exibirBotao === "string" && mensagemState.exibirBotao.length > 0
      ? mensagemState.exibirBotao
      : typeof mensagemState.exibirBotao === "boolean" && mensagemState.exibirBotao
        ? "Fechar"
        : ""

  const MontaMensagem = () => {
    const tipo = mensagemState.tipo.toLowerCase() as keyof typeof iconMap
    const { Icon, color } = iconMap[tipo] || iconMap.info
    // Determina se deve aplicar a animação
    const isLoader = mensagemState.tipo === "loading";

    return (
      <div className="flex flex-col items-center justify-center p-4 text-center">
        <Condicional condicao={mensagemState.titulo.length > 0}>
          <h2 className="text-lg font-bold mb-2">{mensagemState.titulo}</h2>
        </Condicional>

        <div className={`flex items-center gap-3 p-3 rounded-lg border ${color} w-full justify-center`}>
          {/* Renderiza o Icon, aplicando animate-spin SOMENTE se for loading */}
          <Icon className={`w-6 h-6 ${isLoader ? "animate-spin" : ""}`} />

          <span className="text-sm font-medium">{mensagemState.mensagem}</span>
        </div>

        <Condicional condicao={exibirBotao()}>
          <div className="flex justify-end gap-3 mt-4">
            <Condicional condicao={mensagemState.exibirBotao !== "SN"}>
              <button
                onClick={fecharJanela}
                className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition"
              >
                {textoBotao()}
              </button>
            </Condicional>

            <Condicional condicao={mensagemState.exibirBotao === "SN"}>
              <button
                onClick={() => btResposta(true)}
                className="bg-green-600 text-white rounded-lg px-4 py-2 hover:bg-green-700 transition"
              >
                Sim
              </button>
              <button
                onClick={() => btResposta(false)}
                className="bg-red-600 text-white rounded-lg px-4 py-2 hover:bg-red-700 transition"
              >
                Não
              </button>
            </Condicional>
          </div>
        </Condicional>
      </div>
    )
  }

  if (!mensagemState.exibir) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-4">
        <MontaMensagem />
      </div>
    </div>
  )
}
