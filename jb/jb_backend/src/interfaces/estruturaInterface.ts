export interface EstruturaInterface {
  idEstrutura?: number
  idProduto: number
  idUnidade: number
  qtdBase: number
  detalheEstruturas: Array<DetalheEstruturaInterface>
}

export interface DetalheEstruturaInterface {
  idDetalheEstrutura?: number;
  idEstrutura: number | null;
  idProduto: number;
  idCor?: number | null;
  qtd: number;
}
