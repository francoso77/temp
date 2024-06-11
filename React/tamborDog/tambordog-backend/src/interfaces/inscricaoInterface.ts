import { InscricaoTypes } from '../types/InscricaoTypes'

export interface InscricaoInterface {
  idInscricao?: string
  idAtleta: string
  idCao: string
  idCategoria: string
  idProva: string
  valor: number
  statusInscricao: InscricaoTypes
}
