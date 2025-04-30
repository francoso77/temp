import { SumulaTypes } from '../types/SumulaTypes'

export interface SumulaInterface {
  idSumula?: string
  idInscricao: string
  tempoPista: Date
  penalidade: Date
  classificacao: Date
  dataHoraApuracao: Date
  ordemEntrada: number
  statusSumula: SumulaTypes
}
