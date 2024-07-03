export interface RespostaPadraoInterface<T> {
  ok: boolean;
  mensagem: string;
  dados?: T;
}

export interface PadraoPesquisaInterface {
  entidade: string,
  criterio: Record<string, any>,
  camposLike?: Array<any>,
  select?: Array<any>,
  joins?: { tabelaRelacao: string, relacao: string }[],
}
