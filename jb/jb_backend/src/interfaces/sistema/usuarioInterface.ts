import { UsuarioType } from '../../types/usuarioTypes';

export interface UsuarioInterface {
  idUsuario?: number;
  nome: string;
  email: string;
  cpf: string;
  senha: string;
  ativo: boolean;
  tentativasLogin: number;
  tipoUsuario: UsuarioType;
}

export interface UsuarioSessaoInterface {
  idSessao?: number;
  idUsuario: number;
  token: string;
  ativo: boolean;
  tipoUsuario: UsuarioType;
}

export interface UsuarioPermissaoInterface {
  idUsuarioPermissao?: number;
  idUsuario: number;
  //idModulo: number;
  idModuloPermissao: number;
}