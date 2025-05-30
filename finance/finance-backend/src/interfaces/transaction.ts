export interface TransactionInterface {
  id?: string
  description: string
  amount: number
  type: 'Receita' | 'Despesa'
  setor: 'Dublagem' | 'Malharia'
  categoryId: string
  accountId: string
  companyId: string
  date: string
}