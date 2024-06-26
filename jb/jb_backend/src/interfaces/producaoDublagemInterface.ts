import { TipoColagemTypes } from '../types/tipoColagemTypes';

export interface ProducaoDublagemInterface {
  idDublagem?: number
  dataProducao: string
  tipoColagem: TipoColagemTypes
  qtdColagem: number
}

export interface DetalheProducaoDublagemInterface {
  idDetalheProducaoDublagem?: number;
  idProducaoDublagem: number;
  idProduto: number;
  metro: number;
}