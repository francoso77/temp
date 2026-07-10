import { PedidoDublagemInterface } from './pedidoDublagemInterface';

export interface ProgramacaoDublagemInterface {
  idProgramacaoDublagem?: number
  dataProgramacao: string
  qtdCola: number
  qtdFilme: number
  detalheProgramacaoDublagens: DetalheProgramacaoDublagemInterface[]
}

export interface DetalheProgramacaoDublagemInterface {
  idDetalheProgramacaoDublagem?: number
  idProgramacaoDublagem: number | null
  idPedido: number
  pedido: PedidoDublagemInterface
}