import { PermissoesTypeInterface } from '../types/permissoesTypes'
import { UsuarioType } from '../types/usuarioTypes'

export interface LoginInterface {
  idUsuario: number
  nomeUsuario: string
  tipoUsuario: UsuarioType
  token: string
  permissoes: PermissoesTypeInterface
}