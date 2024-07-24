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
  idCor: number
  qtdPecas: number
  vrUnitario: number
  qtd: number
  metro: number
  gm2: number
  idPessoa_revisador: number
  idTinturaria: number
  perdaMalharia: number
  perdaTinturaria: number
}