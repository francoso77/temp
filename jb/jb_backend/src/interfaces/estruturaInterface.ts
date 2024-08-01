export interface EstruturaInterface {
  idEstrutura?: number
  idProduto: number
  idUnidade: number
  qtdBase: number
}

export interface DetalheEstruturaInterface {
  idDetalheEstrutura?: number;
  idEstrutura: number;
  idProduto: number;
  idCor?: number;
  qtd: number;
}
