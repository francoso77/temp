export enum actionTypes {
  pesquisando = 'pesquisando',
  editando = 'editando',
  excluindo = 'excluindo',
  incluindo = 'incluindo',
  duplicando = 'duplicando',
}

export interface ActionInterface {
  action: string
}