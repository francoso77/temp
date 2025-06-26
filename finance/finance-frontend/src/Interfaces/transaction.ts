import { AccountInterface } from './account'
import { CategoryInterface } from './category'
import { CompanyInterface } from './company'
import { SectorInterface } from './sector'

export interface TransactionInterface {
  id?: string
  description: string
  amount: number
  qtd: number
  price: number
  categoryId: string
  accountId: string
  companyId: string
  sectorId: string
  date: string
  userId?: string
  company?: CompanyInterface
  category?: CategoryInterface
  sector?: SectorInterface
  account?: AccountInterface
}