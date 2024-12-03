import { useContext, useRef, useState } from 'react';
import { ProgramacaoInterface } from '../../../../jb_backend/src/interfaces/programacaoInterface';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import { ActionInterface, actionTypes } from '../../Interfaces/ActionInterface';
import { PessoaInterface } from '../../../../jb_backend/src/interfaces/pessoaInterface';
import { TinturariaInterface } from '../../../../jb_backend/src/interfaces/tinturariaInterface';


export interface SomatorioEntradaInterface {
  total: string
  totalQtd: string
}

export default function ProgramacaoTinturaria() {

  const ResetDados: ProgramacaoInterface = {
    dataProgramacao: '',
    notaFiscal: null,
    idTinturaria: 0,
    msg: '',
    idPessoa_cliente: 0,
    detalheProgramacoes: [],
  }

  interface PesquisaInterface {
    itemPesquisa: string
  }

  const SomatorioDados: SomatorioEntradaInterface = {
    total: '',
    totalQtd: ''
  }

  const { setMensagemState, setLayoutState } = useContext(GlobalContext) as GlobalContextInterface
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando })
  const [rsPesquisa, setRsPesquisa] = useState<Array<any>>([])
  const [erros, setErros] = useState({})
  const [programacao, setProgramacao] = useState<ProgramacaoInterface>(ResetDados)
  const [rsCliente, setRsCliente] = useState<Array<PessoaInterface>>([])
  const [pesquisa, setPesquisa] = useState<PesquisaInterface>({ itemPesquisa: '' })
  const [rsTinturaria, setRsTinturaria] = useState<Array<TinturariaInterface>>([])
  const [rsSomatorio, setRsSomatorio] = useState<SomatorioEntradaInterface>(SomatorioDados)
  const fieldRefs = useRef<(HTMLDivElement | null)[]>([])

  return (
    <>

    </>
  )
}