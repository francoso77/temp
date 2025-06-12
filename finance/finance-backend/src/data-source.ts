import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from './entity/sistema/user'
import { UserSection } from './entity/sistema/userSection'
import Account from './entity/account'
import Category from './entity/category'
import Company from './entity/company'
import Transaction from './entity/transaction'

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "Frk@071569#",
  //password: "071569", //casa
  database: "finance",
  synchronize: true,
  logging: false,
  entities: [
    User,
    UserSection,
    Account,
    Category,
    Company,
    Transaction
  ],// ./entity/**'
  migrations: [],
  subscribers: [],
})
