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
  resetToken: string;
  resetTokenExpires: Date;
  idPessoa_vendedor?: number;
}

export interface UsuarioSessaoInterface {
  idSessao?: number;
  idUsuario: number;
  token: string;
  ativo: boolean;
}

export interface UsuarioPermissaoInterface {
  idUsuarioPermissao?: number;
  idUsuario: number;
  idModuloPermissao: number;
}