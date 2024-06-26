export interface TinturariaInterface {
  idTinturaria?: number
  dataTinturaria: string
  idPessoa_cliente: number
  idPessoa_fornecedor: number
}

export interface DetalheTinturariaInterface {
  idDetalheTinturaria?: number
  idTinturaria: number
  idPeca: number
}