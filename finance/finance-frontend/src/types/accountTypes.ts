export enum AccountType {
  corrente = 'corrente',
  poupanca = 'poupanca',
  investimento = 'investimento',
  credito = 'credito',
  dinheiro = 'dinheiro',
  outros = 'outros'
}

export const AccountTypes = [
  {
    idAccountType: AccountType.corrente,
    descricao: 'Conta Corrente'
  },
  {
    idAccountType: AccountType.poupanca,
    descricao: 'Conta Poupança'
  },
  {
    idAccountType: AccountType.investimento,
    descricao: 'Conta Investimento'
  },
  {
    idAccountType: AccountType.credito,
    descricao: 'Cartão de Credito'
  },
  {
    idAccountType: AccountType.dinheiro,
    descricao: 'Caixa'
  },
  {
    idAccountType: AccountType.outros,
    descricao: 'Outros'
  },
]