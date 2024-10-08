import { ProducaoMalhariaInterface } from './producaoMalhariaInterface'

export interface TinturariaInterface {
  idTinturaria?: number
  dataTinturaria: string
  idPessoa_cliente: number
  idPessoa_fornecedor: number
}

export interface DetalheTinturariaInterface {
  idDetalheTinturaria?: number
  idTinturaria: number | null
  idMalharia: number
  malharia: ProducaoMalhariaInterface
}