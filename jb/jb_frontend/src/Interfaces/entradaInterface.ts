import { CorInterface } from "./corInteface"
import { PessoaInterface } from "./pessoaInterface"
import { ProdutoInterface } from "./produtoInterface"
import { TinturariaInterface } from "./tinturariaInterface"

export interface EntradaInterface {
  idEntrada?: number
  dataEmissao: string
  observacao: string
  notaFiscal: string
  idPessoa_fornecedor: number
  detalheEntradas: DetalheEntradaInterface[]
}

export interface DetalheEntradaInterface {
  idDetalheEntrada?: number
  idEntrada: number | null
  idProduto: number
  idCor?: number | null
  qtdPecas?: number
  vrUnitario: number
  qtd: number
  metro?: number
  gm2?: number
  idPessoa_revisador?: number | null
  idTinturaria?: number | null
  perdaMalharia?: number
  perdaTinturaria?: number
  produto: ProdutoInterface
  cor: CorInterface
  revisador: PessoaInterface
  romaneio: TinturariaInterface
}