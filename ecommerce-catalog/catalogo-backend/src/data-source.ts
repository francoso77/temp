import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from './entity/sistema/user'
import { UserSection } from './entity/sistema/userSection'
import * as dotenv from "dotenv";
import Produto from './entity/produto';
import Categoria from './entity/categoria';
import Cliente from './entity/cliente';
import Pedido from './entity/pedido';
import DetalhePedido from './entity/detalhePedido';
import { Notificacao } from './entity/notification';
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
    Produto,
    Categoria,
    Cliente,
    Pedido,
    DetalhePedido,
    Notificacao
  ],
  //migrations: [__dirname + (isCompiled ? '/migration/*.js' : '/migration/*.ts')],
  subscribers: [],
})
