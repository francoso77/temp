import { useState } from "react"

export interface LayoutStateInterface {
  titulo: string
  tituloAnterior: string
  pathTitulo: string
  pathTituloAnterior: string
}

export default function useLayoutState() {
  const [layoutState, setLayoutState] = useState<LayoutStateInterface>({
    titulo: '',
    tituloAnterior: '',
    pathTitulo: '',
    pathTituloAnterior: ''
  })

  return { layoutState, setLayoutState }
}