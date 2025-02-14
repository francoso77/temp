import { useState } from "react"
import { UsuarioType } from '../types/usuarioTypes'
import { LoginInterface } from '../../../jb_backend/src/interfaces/loginIterface'
import { PermissoesTypes } from '../types/permissoesTypes'

export interface UsuarioStateInterface extends LoginInterface {
  logado: boolean
  idsMenu: Array<number>
}

export default function useUsuarioState() {
  const [usuarioState, setUsuarioState] = useState<UsuarioStateInterface>({
    idUsuario: 0,
    nomeUsuario: '',
    logado: false,
    token: '',
    tipoUsuario: UsuarioType.admin,
    //idsMenu: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    idsMenu: [6, 10],
    permissoes: PermissoesTypes
  })

  return { usuarioState, setUsuarioState }
}
