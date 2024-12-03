import { CorInterface } from './corInteface'
import { ProdutoInterface } from './produtoInterface'

export interface ProgramacaoInterface {
  idProgramacao?: number
  dataProgramacao: string
  notaFiscal: string | null
  idTinturaria: number
  msg: string
  idPessoa_cliente: number
  detalheProgramacoes: DetalheProgramacaoInterface[]
}

export interface DetalheProgramacaoInterface {
  idDetalheProgramacao?: number
  idProgramacao: number
  idProduto: number
  idCor: number
  peso: number
  gm2: number
  largura: number
  qtdPeca: number
  produto: ProdutoInterface
  cor: CorInterface
}