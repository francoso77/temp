export interface AccountInterface {
  id?: string
  name: string
  type: 'checking' | 'savings' | 'investment' | 'credit' | 'cash' | 'other'
  initialBalance: number
  currency: string
  color: string
  isDefault?: boolean
}