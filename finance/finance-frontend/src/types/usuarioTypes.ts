export enum UsuarioType {
  default = 0,
  admin = 1,
  estoquistaMalharia = 2,
  estoquistaDublagem = 3,
  producaoDublagem = 4,
  vendedor = 5
}

export const UsuarioTypes = [
  {
    idUsuarioType: UsuarioType.default,
    descricao: 'Usuário Padrão'
  },
  {
    idUsuarioType: UsuarioType.admin,
    descricao: 'Usuário Administrador'
  },
  {
    idUsuarioType: UsuarioType.estoquistaMalharia,
    descricao: 'Usuário Estoque Malharia'
  },
  {
    idUsuarioType: UsuarioType.estoquistaDublagem,
    descricao: 'Usuário Estoque Dublagem'
  },
  {
    idUsuarioType: UsuarioType.producaoDublagem,
    descricao: 'Usuário Produção Dublagem'
  },
  {
    idUsuarioType: UsuarioType.vendedor,
    descricao: 'Usuário Vendedor'
  },
]