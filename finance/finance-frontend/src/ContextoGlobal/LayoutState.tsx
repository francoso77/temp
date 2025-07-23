import { useState } from "react"
import { MenuOpcoesInterface } from "../app/Layout/ClsMenu"

export interface LayoutStateInterface {
  titulo: string
  pathTitulo: string
  exibirMenu?: boolean
  opcoesMenu?: MenuOpcoesInterface[]
  contaPadrao?: string | null
  dataInicio?: string | null
  dataFim?: string | null
  accountId?: string | null
  categoryId?: string | null
  type?: string | null;
  sectorId?: string | null
  companyId?: string | null
}

export default function useLayoutState() {
  const [layoutState, setLayoutState] = useState<LayoutStateInterface>({
    titulo: '',
    pathTitulo: '',
    exibirMenu: false,
    opcoesMenu: [],
    contaPadrao: null,
    dataInicio: null,
    dataFim: null,
    categoryId: null,
    accountId: null,
    type: null,
    sectorId: null,
    companyId: null
  })

  return { layoutState, setLayoutState }
}