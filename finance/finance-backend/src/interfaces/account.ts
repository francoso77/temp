export interface AccountInterface {
  id?: string
  name: string
  type: 'corrente' | 'poupanca' | 'investimento' | 'credito' | 'dinheiro' | 'outros'
  initialBalance: number
  color: string
  isDefault?: boolean
}