import { useState } from "react"
import { UsuarioType } from '../types/usuarioTypes'
import { PermissoesTypes } from '../types/permissoesTypes'
import { LoginInterface } from '../Interfaces/loginIterface'

export interface UsuarioStateInterface extends LoginInterface {
  logado: boolean
  idsMenu: Array<number>
}

export default function useUsuarioState() {
  const [usuarioState, setUsuarioState] = useState<UsuarioStateInterface>({
    idUsuario: 0,
    nomeUsuario: '',
    cpfUsuario: '',
    logado: false,
    token: '',
    tipoUsuario: UsuarioType.admin,
    //idsMenu: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    idsMenu: [6, 10],
    permissoes: PermissoesTypes,
    idVendedor: 0
  })

  return { usuarioState, setUsuarioState }
}
