import { PisoTypes } from '../types/PisoTypes'
import { ProvaTypes } from '../types/ProvaTypes'

export interface ProvaInterface {
  idProva?: string
  nomeProva: string
  endereco: string
  numero: number
  bairro: string
  cidade: string
  uf: string
  cep: string
  localizacao: string
  adicionais: string
  piso: PisoTypes
  dataProva: string
  horaProva: string
  valorProva: number
  valorProvaAte12: number
  telefone: string
  whatsapp: string
  email: string
  status: ProvaTypes
  idCampeonato: string | null
}
