import { useState } from "react"
import { UsuarioType } from '../types/usuarioTypes'

export interface UsuarioStateInterface {
  idUsuario: number
  usuario: string
  logado: boolean
  token: string
  tipoUsuario: UsuarioType
  idsMenu: Array<number>
}

export default function useUsuarioState() {
  const [usuarioState, setUsuarioState] = useState<UsuarioStateInterface>({
    idUsuario: 0,
    usuario: '',
    logado: false,
    token: '',
    tipoUsuario: UsuarioType.admin,
    //idsMenu: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    idsMenu: [6, 10]
  })

  return { usuarioState, setUsuarioState }
}
