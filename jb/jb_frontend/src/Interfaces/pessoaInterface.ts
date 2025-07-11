import { PessoaType } from '../types/pessoaTypes'

export interface PessoaInterface {
  idPessoa?: number
  nome: string
  apelido?: string
  cpf_cnpj?: string
  endereco?: string
  numero?: number
  bairro?: string
  cidade?: string
  uf?: string
  cep?: string
  telefone: string
  whatsapp: string
  email?: string
  tipoPessoa: PessoaType
  comissao?: number
  ativo: boolean
}