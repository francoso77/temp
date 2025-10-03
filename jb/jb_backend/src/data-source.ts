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
import PerdaMalharia from './entities/perdaMalharia.entity'
import ProgramacaoDublagem from './entities/programacaoDublagem.entity'
import DetalheProgramacaoDublagem from './entities/detalheProgramacaoDublagem.entity'
import { Usuario } from './entities/sistema/usuario.entity'
import { UsuarioSessao } from './entities/sistema/usuarioSessao.entity'
import DetalhePeca from './entities/detalhePeca.entity'
import { Grupo } from './entities/sistema/grupo.entity'
import { GrupoPermissao } from './entities/sistema/grupoPermissao.entity'
import { GrupoUsuario } from './entities/sistema/grupoUsuario.entity'
import { UsuarioPermissao } from './entities/sistema/usuarioPermissao.entity'
import { Modulo } from './entities/sistema/modulo.entity'
import { ModuloPermissao } from './entities/sistema/moduloPermissao.entity'
import * as dotenv from "dotenv";
import { Notification } from './entities/sistema/notification.entity'
dotenv.config();

export const AppDataSource = new DataSource({
  type: process.env.DB_TYPE as any,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "3306", 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: false,
  entities: [
    Cor,
    DetalheEntrada,
    DetalheEstrutura,
    DetalhePeca,
    DetalhePedido,
    DetalheProducaoDublagem,
    DetalheProgramacao,
    DetalheProgramacaoDublagem,
    DetalheTinturaria,
    Grupo,
    GrupoPermissao,
    GrupoUsuario,
    Entrada,
    Estoque,
    Estrutura,
    Maquina,
    Modulo,
    ModuloPermissao,
    Pedido,
    Pessoa,
    PerdaMalharia,
    PrazoEntrega,
    ProducaoDublagem,
    ProducaoMalharia,
    Produto,
    Programacao,
    ProgramacaoDublagem,
    Tinturaria,
    UnidadeMedida,
    Usuario,
    UsuarioPermissao,
    UsuarioSessao,
    Notification,
  ],
  migrations: [],
  subscribers: [],
})
