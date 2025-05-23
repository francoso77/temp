export interface CategoryInterface {
  id?: string
  name: string
  type: 'income' | 'expense' | 'both'
  color: string
}