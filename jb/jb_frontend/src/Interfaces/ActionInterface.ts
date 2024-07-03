export enum actionTypes {
  pesquisando = 'pesquisando',
  editando = 'editando',
  excluindo = 'excluindo',
  incluindo = 'incluindo',
  detalhes = 'detalhes',
  pessoa = 'pessoa'
}

export interface ActionInterface {
  action: string
}