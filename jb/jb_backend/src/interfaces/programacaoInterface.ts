export interface ProgramacaoInterface {
  idProgramacao?: number
  dataProgramacao: string
  notaFiscal: string
  idTinturaria: number
  msg: string
  idPessoa_cliente: number
}

export interface DetalheProgramacaoInterface {
  idDetalheProgramacao?: number
  idProgramacao: number
  idProduto: number
  idCor: number
  peso: number
  gm2: number
  largura: number
  qtdPeca: number
}