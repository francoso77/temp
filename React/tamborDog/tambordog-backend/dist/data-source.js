"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
var typeorm_1 = require("typeorm");
var atleta_entity_1 = require("./entities/atleta.entity");
var cao_entity_1 = require("./entities/cao.entity");
var inscricao_entity_1 = require("./entities/inscricao.entity");
var prova_entity_1 = require("./entities/prova.entity");
var campeonato_entity_1 = require("./entities/campeonato.entity");
var sumula_entity_1 = require("./entities/sumula.entity");
var raca_entity_1 = require("./entities/raca.entity");
var categoria_entity_1 = require("./entities/categoria.entity");
var user_entity_1 = require("./entities/user.entity");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: "66.94.105.135",
    port: 3306,
    username: "fsd0043",
    password: "FleekPass@2023a",
    database: "fsd0043_francoso",
    synchronize: true,
    logging: false,
    entities: [atleta_entity_1.default, cao_entity_1.default, inscricao_entity_1.default, prova_entity_1.default, campeonato_entity_1.default, user_entity_1.User, sumula_entity_1.default, raca_entity_1.default, categoria_entity_1.default],
    migrations: [],
    subscribers: [],
});
//# sourceMappingURL=data-source.js.map