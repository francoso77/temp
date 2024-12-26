import { useState } from "react"
import { MenuOpcoesInterface } from "../app/Layout/ClsMenu"

export interface LayoutStateInterface {
  titulo: string
  tituloAnterior: string
  pathTitulo: string
  pathTituloAnterior: string
  exibirMenu?: boolean
  opcoesMenu?: MenuOpcoesInterface[]
}

export default function useLayoutState() {
  const [layoutState, setLayoutState] = useState<LayoutStateInterface>({
    titulo: '',
    tituloAnterior: '',
    pathTitulo: '',
    pathTituloAnterior: '',
    exibirMenu: false,
    opcoesMenu: []
  })

  return { layoutState, setLayoutState }
}