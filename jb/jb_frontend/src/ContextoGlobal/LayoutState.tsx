import { useState } from "react"
import { EstruturaMenuInterface } from '../admin/Layout/MenuCls'

export interface LayoutStateInterface {
  titulo: string
  tituloAnterior: string
  pathTitulo: string
  pathTituloAnterior: string
  exibirMenu?: boolean
  opcoesMenu?: EstruturaMenuInterface[]
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