export interface RespostaPadraoInterface<T> {
  ok: boolean;
  mensagem: string;
  dados?: T;
}

export interface PadraoPesquisaInterface {
  entidade?: string,
  criterio?: Record<string, any>,
  camposLike?: Array<any>,
  select?: Array<any>,
  joins?: { tabelaRelacao: string, relacao: string }[],
  sql?: string,
  entidadeMaster?: string,
  master?: Record<string, any>,
  entidadeDetalhe?: string,
  detalhes?: Record<string, any>,
  id?: string,
  relations?: Array<string>,
  campoOrder?: Array<any>,
  notOrLike?: "N" | "L" | "I",
  groupBy?: string,
  having?: string,
}
