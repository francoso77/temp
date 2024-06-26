export interface EstruturaInterface {
  idEstrutura?: number
  idProduto: number
  unidade: string
  qtdBase: number
}

export interface DetalheEstruturaInterface {
  idDetalheEstrutura?: number;
  idEstrutura: number;
  idProduto: number;
  idCor: number;
  qtd: number;
}