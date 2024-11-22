import { useState } from "react"

export interface UsuarioStateInterface {
  usuario: string
  logado: boolean
  token: string
}

export default function useUsuarioState() {
  const [usuarioState, setUsuarioState] = useState<UsuarioStateInterface>({
    usuario: 'Frank',
    logado: true,
    token: 'jacares'
  })

  return { usuarioState, setUsuarioState }
}
