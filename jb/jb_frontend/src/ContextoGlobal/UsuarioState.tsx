import { useState } from "react"

export interface UsuarioStateInterface {
  usuario: string
  logado: boolean
}

export default function useUsuarioState() {
  const [usuarioState, setUsuarioState] = useState<UsuarioStateInterface>({
    usuario: "007.323.026-09",
    logado: true
  })

  return { usuarioState, setUsuarioState }
}
