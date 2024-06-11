import "reflect-metadata"
import { DataSource } from "typeorm"
import Atleta from './entity/Atleta'
import Raca from './entity/Raca'
import Cao from './entity/Cao'
import Campeonato from './entity/Campeonato'
import Inscricao from './entity/Inscricao'
import Prova from './entity/Prova'
import Sumula from './entity/Sumula'
import Categoria from './entity/Categoria'


export const AppDataSource = new DataSource({
    type: "mysql",
    host: "66.94.105.135",
    port: 3306,
    username: "fsd0043",
    password: "FleekPass@2023a",
    database: "fsd0043_francoso",
    synchronize: true,
    // tudo que vier diferente ele dropa e coloca os dados
    logging: true,
    entities: [Atleta, Raca, Cao, Campeonato, Inscricao, Prova, Sumula, Categoria],
    migrations: [],
    subscribers: [],
})
