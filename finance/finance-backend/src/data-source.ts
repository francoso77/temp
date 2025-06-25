import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from './entity/sistema/user'
import { UserSection } from './entity/sistema/userSection'
import Account from './entity/account'
import Category from './entity/category'
import Company from './entity/company'
import Transaction from './entity/transaction'
import Sector from './entity/sector'

export const AppDataSource = new DataSource({

  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "Frk@071569#",
  database: process.env.DB_DATABASE || "finance",
  synchronize: false,
  logging: false,
  entities: [
    User,
    UserSection,
    Account,
    Category,
    Company,
    Transaction,
    Sector
  ],
  migrations: [],
  subscribers: [],
})
