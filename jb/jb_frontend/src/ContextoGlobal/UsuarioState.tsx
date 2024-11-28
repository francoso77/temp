import { useState } from "react"
import { UsuarioType } from '../types/usuarioTypes'

export interface UsuarioStateInterface {
  usuario: string
  logado: boolean
  token: string
  tipoUsuario: UsuarioType
  idsMenu: Array<number>
}

export default function useUsuarioState() {
  const [usuarioState, setUsuarioState] = useState<UsuarioStateInterface>({
    usuario: '',
    logado: false,
    token: '',
    tipoUsuario: UsuarioType.default,
    idsMenu: [5, 7]
  })

  return { usuarioState, setUsuarioState }
}
