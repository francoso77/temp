import { MensagemStateInterface } from '@/contexts/MensagemState'
import { LoginInterface } from '../interfaces/sistema/user'

export interface AuthContextType {
  user: LoginInterface | null
  login: (email: string, senha?: string, tipo?: "cliente" | "vendedor") => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  isVendedor: boolean
  vendedorId?: string // ID do vendedor logado
  mensagemState: MensagemStateInterface
  setMensagemState: React.Dispatch<React.SetStateAction<MensagemStateInterface>>
}