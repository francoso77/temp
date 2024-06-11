import "reflect-metadata"
import { DataSource } from "typeorm"
import { Jacare } from './entity/Teste'

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "66.94.105.135",
    port: 3306,
    username: "fsd0043",
    password: "FleekPass@2023a",
    database: "fsd0043_francoso",
    synchronize: true,
    logging: false,
    entities: [Jacare],
    migrations: [],
    subscribers: [],
})
