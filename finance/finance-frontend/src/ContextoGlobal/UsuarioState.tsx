import { useState } from "react"
import { LoginInterface } from '../Interfaces/login';

export interface UsuarioStateInterface extends LoginInterface {
  logado: boolean,
  fotoUsuarioVersao?: number;
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
