export enum actionTypes {
  pesquisando = 'pesquisando',
  editando = 'editando',
  excluindo = 'excluindo',
  incluindo = 'incluindo',
  detalhes = 'detalhes',
}

export interface ActionInterface {
  action: string
}