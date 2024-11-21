export interface UsuarioInterface {
  idUsuario?: number;
  nome: string;
  cpf: string;
  senha: string;
  ativo: boolean;
  tentativasLogin: number;
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
  //idModulo: number;
  idModuloPermissao: number;
}