import { TipoColagemType } from '../types/tipoColagemTypes';
import { ProdutoInterface } from './produtoInterface';

export interface ProducaoDublagemInterface {
  idDublagem?: number
  dataProducao: string
  tipoColagem: TipoColagemType
  idPedido: number
  detalheProducaoDublagens: DetalheProducaoDublagemInterface[]
}

export interface DetalheProducaoDublagemInterface {
  idDetalheProducaoDublagem?: number
  idDublagem: number | null
  idProduto: number
  metrosTotal: number
  pecasTotal: number
  produto: ProdutoInterface
  detalhePecas: DetalhePecaInterface[]
}

export interface DetalhePecaInterface {
  idDetalhePeca?: number
  idDetalheProducaoDublagem: number | null
  metros: number
}