import "reflect-metadata"
import { DataSource } from "typeorm"
import Atleta from './entities/atleta.entity'
import Cao from './entities/cao.entity'
import Inscricao from './entities/inscricao.entity'
import Prova from './entities/prova.entity'
import Campeonato from './entities/campeonato.entity'
import Sumula from './entities/sumula.entity'
import Raca from './entities/raca.entity'
import Categoria from './entities/categoria.entity'
import { User } from './entities/user.entity'

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "66.94.105.135",
  port: 3306,
  username: "fsd0043",
  password: "FleekPass@2023a",
  database: "fsd0043_francoso",
  synchronize: true,
  logging: false,
  entities: [Atleta, Cao, Inscricao, Prova, Campeonato, User, Sumula, Raca, Categoria],
  migrations: [],
  subscribers: [],
})
