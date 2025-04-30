export enum actionTypes {
  pesquisando = 'pesquisando',
  editando = 'editando',
  excluindo = 'excluindo',
  incluindo = 'incluindo'
}

export interface ActionInterface {
  action: string
}