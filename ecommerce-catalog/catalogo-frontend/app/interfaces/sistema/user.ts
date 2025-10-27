export interface LoginInterface {
  idUsuario: string
  nomeUsuario: string
  emailUsuario: string
  token: string
  tipoUsuario: 'cliente' | 'vendedor'
  logado: boolean
}
export interface UserInterface {
  id?: string;
  nome: string;
  email: string;
  cnpj: string;
  whatsapp: string;
  isActive: boolean;
}