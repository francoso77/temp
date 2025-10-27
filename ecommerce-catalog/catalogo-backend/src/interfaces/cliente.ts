export interface ClienteInterface {
  id: string
  nome: string
  email: string
  telefone?: string
  cnpj?: string
  ativo: boolean
  idVendedor: string // Cliente pertence a um vendedor
  dataCadastro: string
}