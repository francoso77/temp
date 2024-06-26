import { TurnoTypes } from '../types/turnoTypes'

export interface ProducaoMalhariaInterface {
  idPeca?: number
  idMaquina: number
  idProduto: number
  dataProducao: string
  turno: TurnoTypes
  peso: number
  localizacao?: string
  idPessoa_revisador: number
  idPessoa_tecelao: number
  fechado?: boolean
  dataFechado?: string
  idTinturaria?: number
}
