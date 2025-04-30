import { PisoTypes } from '../types/PisoTypes'
import { StatusProvaType } from '../types/ProvaTypes'

export interface ProvaInterface {
  idProva?: string
  nomeProva: string
  endereco: string
  numero: number
  bairro: string
  cidade: string
  uf: string
  cep: string
  lat: string;
  long: string;
  tipoPiso: PisoTypes;
  dataHoraProva: Date;
  valorProva: number
  valorProvaAte12: number
  telefone: string
  whatsapp: string
  email: string
  status: StatusProvaType;
  termoAceite: string;
  foto: boolean;
  idCampeonato: string | null
}

export interface ProvaCategoriaInterface {
  idProvaCategoria?: string;
  idProva: string;
  idCategoria: string;
  qtdPistas: number;
}