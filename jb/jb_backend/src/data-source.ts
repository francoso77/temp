import "reflect-metadata"
import { DataSource } from "typeorm"
import Cor from './entities/cor.entity'
import DetalheEntrada from './entities/detalheEntrada.entity'
import DetalheEstrutura from './entities/detalheEstrutura.entity'
import DetalhePedido from './entities/detalhePedido.entity'
import DetalheProducaoDublagem from './entities/detalheProducaoDublagem.entity'
import DetalheProgramacao from './entities/detalheProgramacao.entity'
import DetalheTinturaria from './entities/detalheTinturaria.entity'
import Entrada from './entities/entrada.entity'
import Estoque from './entities/estoque.entity'
import Estrutura from './entities/estrutura.entity'
import Maquina from './entities/maquina.entity'
import Pedido from './entities/pedido.entity'
import Pessoa from './entities/pessoa.entity'
import PrazoEntrega from './entities/prazoEntrega.entity'
import ProducaoDublagem from './entities/producaoDublagem.entity'
import ProducaoMalharia from './entities/producaoMalharia.entity'
import Produto from './entities/produto.entity'
import Programacao from './entities/programacao.entity'
import Tinturaria from './entities/tinturaria.entity'
import UnidadeMedida from './entities/unidadeMedida.entity'
import { User } from './entities/user.entity'


export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  // password: "Frk@071569#",
  password: "071569",
  database: "jb",
  synchronize: true,
  logging: false,
  entities: [
    Cor,
    DetalheEntrada,
    DetalheEstrutura,
    DetalhePedido,
    DetalheProducaoDublagem,
    DetalheProgramacao,
    DetalheTinturaria,
    Entrada,
    Estoque,
    Estrutura,
    Maquina,
    Pedido,
    Pessoa,
    PrazoEntrega,
    ProducaoDublagem,
    ProducaoMalharia,
    Produto,
    Programacao,
    Tinturaria,
    UnidadeMedida,
    User
  ],
  migrations: [],
  subscribers: [],
})
