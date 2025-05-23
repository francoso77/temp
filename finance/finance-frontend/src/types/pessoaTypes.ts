export enum PessoaType {
  clienteFisica = 'C',
  clienteJuridica = 'J',
  fornecedor = 'F',
  vendedor = 'V',
  revisador = 'R',
  tecelao = 'T'
}

export const PessoaTypes = [
  {
    idPessoaType: PessoaType.clienteFisica,
    descricao: 'Cliente Pessoa Física'
  },
  {
    idPessoaType: PessoaType.clienteJuridica,
    descricao: 'Cliente Pessoa Jurídica'
  },
  {
    idPessoaType: PessoaType.fornecedor,
    descricao: 'Fornecedor'
  },
  {
    idPessoaType: PessoaType.revisador,
    descricao: 'Revisador'
  },
  {
    idPessoaType: PessoaType.tecelao,
    descricao: 'Tecelão'
  },
  {
    idPessoaType: PessoaType.vendedor,
    descricao: 'Vendedor'
  },
]