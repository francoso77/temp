import { TipoColagemType } from '../types/tipoColagemTypes';

export interface ProducaoDublagemInterface {
  idDublagem?: number
  dataProducao: string
  tipoColagem: TipoColagemType
  idPedido: number
  idProduto: number
  detalheProducaoDublagens: DetalheProducaoDublagemInterface[]
}

export interface DetalheProducaoDublagemInterface {
  idDetalheProducaoDublagem?: number;
  idDublagem: number | null;
  metros: number;
}