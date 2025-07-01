import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from './entity/sistema/user'
import { UserSection } from './entity/sistema/userSection'
import Account from './entity/account'
import Category from './entity/category'
import Company from './entity/company'
import Transaction from './entity/transaction'
import Sector from './entity/sector'

const isCompiled = __dirname.includes('dist');

export const AppDataSource = new DataSource({

  type: "mysql",
  host: 'mysql',
  port: 3306,
  username: 'root',
  password: 'Frk@071569#',
  database: 'finance',
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
  migrations: [__dirname + (isCompiled ? '/migration/*.js' : '/migration/*.ts')],
  subscribers: [],
})
