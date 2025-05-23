export interface TransactionInterface {
  id?: string
  description: string
  amount: number
  type: 'income' | 'expense'
  categoryId: string
  accountId: string
  date: string
}