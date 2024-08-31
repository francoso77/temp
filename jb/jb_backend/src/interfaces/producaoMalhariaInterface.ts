import { TurnoType } from '../types/turnoTypes'

export interface ProducaoMalhariaInterface {
  idMalharia?: number
  peca: string
  idMaquina: number
  idProduto: number
  dataProducao: string
  turno: TurnoType
  peso: number
  localizacao?: string
  idPessoa_revisador: number
  idPessoa_tecelao: number
  fechado?: boolean
  dataFechado?: string | null
  idTinturaria?: number | null
}
