"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
var typeorm_1 = require("typeorm");
var cor_entity_1 = require("./entities/cor.entity");
var detalheEntrada_entity_1 = require("./entities/detalheEntrada.entity");
var detalheEstrutura_entity_1 = require("./entities/detalheEstrutura.entity");
var detalhePedido_entity_1 = require("./entities/detalhePedido.entity");
var detalheProducaoDublagem_entity_1 = require("./entities/detalheProducaoDublagem.entity");
var detalheProgramacao_entity_1 = require("./entities/detalheProgramacao.entity");
var detalheTinturaria_entity_1 = require("./entities/detalheTinturaria.entity");
var entrada_entity_1 = require("./entities/entrada.entity");
var estoque_entity_1 = require("./entities/estoque.entity");
var estrutura_entity_1 = require("./entities/estrutura.entity");
var maquina_entity_1 = require("./entities/maquina.entity");
var pedido_entity_1 = require("./entities/pedido.entity");
var pessoa_entity_1 = require("./entities/pessoa.entity");
var prazoEntrega_entity_1 = require("./entities/prazoEntrega.entity");
var producaoDublagem_entity_1 = require("./entities/producaoDublagem.entity");
var producaoMalharia_entity_1 = require("./entities/producaoMalharia.entity");
var produto_entity_1 = require("./entities/produto.entity");
var programacao_entity_1 = require("./entities/programacao.entity");
var tinturaria_entity_1 = require("./entities/tinturaria.entity");
var unidadeMedida_entity_1 = require("./entities/unidadeMedida.entity");
var user_entity_1 = require("./entities/user.entity");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "Frk@071569#",
    // password: "071569",
    database: "jb",
    synchronize: true,
    logging: false,
    entities: [
        cor_entity_1.default,
        detalheEntrada_entity_1.default,
        detalheEstrutura_entity_1.default,
        detalhePedido_entity_1.default,
        detalheProducaoDublagem_entity_1.default,
        detalheProgramacao_entity_1.default,
        detalheTinturaria_entity_1.default,
        entrada_entity_1.default,
        estoque_entity_1.default,
        estrutura_entity_1.default,
        maquina_entity_1.default,
        pedido_entity_1.default,
        pessoa_entity_1.default,
        prazoEntrega_entity_1.default,
        producaoDublagem_entity_1.default,
        producaoMalharia_entity_1.default,
        produto_entity_1.default,
        programacao_entity_1.default,
        tinturaria_entity_1.default,
        unidadeMedida_entity_1.default,
        user_entity_1.User
    ],
    migrations: [],
    subscribers: [],
});
//# sourceMappingURL=data-source.js.map