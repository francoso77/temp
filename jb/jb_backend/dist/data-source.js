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
var perdaMalharia_entity_1 = require("./entities/perdaMalharia.entity");
var programacaoDublagem_entity_1 = require("./entities/programacaoDublagem.entity");
var detalheProgramacaoDublagem_entity_1 = require("./entities/detalheProgramacaoDublagem.entity");
var usuario_entity_1 = require("./entities/sistema/usuario.entity");
var usuarioSessao_entity_1 = require("./entities/sistema/usuarioSessao.entity");
var detalhePeca_entity_1 = require("./entities/detalhePeca.entity");
var grupo_entity_1 = require("./entities/sistema/grupo.entity");
var grupoPermissao_entity_1 = require("./entities/sistema/grupoPermissao.entity");
var grupoUsuario_entity_1 = require("./entities/sistema/grupoUsuario.entity");
var usuarioPermissao_entity_1 = require("./entities/sistema/usuarioPermissao.entity");
var modulo_entity_1 = require("./entities/sistema/modulo.entity");
var moduloPermissao_entity_1 = require("./entities/sistema/moduloPermissao.entity");
var dotenv = require("dotenv");
var notification_entity_1 = require("./entities/sistema/notification.entity");
dotenv.config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "3306", 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: true,
    logging: false,
    entities: [
        cor_entity_1.default,
        detalheEntrada_entity_1.default,
        detalheEstrutura_entity_1.default,
        detalhePeca_entity_1.default,
        detalhePedido_entity_1.default,
        detalheProducaoDublagem_entity_1.default,
        detalheProgramacao_entity_1.default,
        detalheProgramacaoDublagem_entity_1.default,
        detalheTinturaria_entity_1.default,
        grupo_entity_1.Grupo,
        grupoPermissao_entity_1.GrupoPermissao,
        grupoUsuario_entity_1.GrupoUsuario,
        entrada_entity_1.default,
        estoque_entity_1.default,
        estrutura_entity_1.default,
        maquina_entity_1.default,
        modulo_entity_1.Modulo,
        moduloPermissao_entity_1.ModuloPermissao,
        pedido_entity_1.default,
        pessoa_entity_1.default,
        perdaMalharia_entity_1.default,
        prazoEntrega_entity_1.default,
        producaoDublagem_entity_1.default,
        producaoMalharia_entity_1.default,
        produto_entity_1.default,
        programacao_entity_1.default,
        programacaoDublagem_entity_1.default,
        tinturaria_entity_1.default,
        unidadeMedida_entity_1.default,
        usuario_entity_1.Usuario,
        usuarioPermissao_entity_1.UsuarioPermissao,
        usuarioSessao_entity_1.UsuarioSessao,
        notification_entity_1.Notification,
    ],
    migrations: [],
    subscribers: [],
});
//# sourceMappingURL=data-source.js.map