import { useState } from "react"
import { LoginInterface } from '../../../finance-backend/src/interfaces/login'

export interface UsuarioStateInterface extends LoginInterface {
  logado: boolean
}

export default function useUsuarioState() {
  const [usuarioState, setUsuarioState] = useState<UsuarioStateInterface>({
    idUsuario: '',
    nomeUsuario: '',
    logado: false,
    token: '',
    emailUsuario: '',
    fotoUsuario: ''
  })

  return { usuarioState, setUsuarioState }
}
