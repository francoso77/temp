import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from './entity/sistema/user'
import { UserSection } from './entity/sistema/userSection'
import Account from './entity/account'
import Category from './entity/category'
import Company from './entity/company'
import Transaction from './entity/transaction'
import Sector from './entity/sector'
import * as dotenv from "dotenv";
dotenv.config();

const isCompiled = __dirname.includes('dist');

export const AppDataSource = new DataSource({

  type: process.env.DB_TYPE as any,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
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
