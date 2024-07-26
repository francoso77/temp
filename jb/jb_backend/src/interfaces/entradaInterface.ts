export interface EntradaInterface {
  idEntrada?: number
  dataEmissao: string
  observacao: string
  notaFiscal: string
  idPessoa_fornecedor: number
}

export interface DetalheEntradaInterface {
  idDetalheEntrada?: number
  idEntrada: number
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
}