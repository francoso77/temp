export interface GrupoInterface {
  idGrupo?: number
  grupo: string
}

export interface GrupoUsuarioInterface {
  idGrupoUsuario?: number
  idUsuario: number
}

export interface GrupoPermissaoInterface {
  idGrupoPermissao?: number
  idGrupo: number
  idModuloPermissao: number
}