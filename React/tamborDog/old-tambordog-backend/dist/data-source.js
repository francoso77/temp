"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
var typeorm_1 = require("typeorm");
var Atleta_1 = require("./entity/Atleta");
var Raca_1 = require("./entity/Raca");
var Cao_1 = require("./entity/Cao");
var Campeonato_1 = require("./entity/Campeonato");
var Inscricao_1 = require("./entity/Inscricao");
var Prova_1 = require("./entity/Prova");
var Sumula_1 = require("./entity/Sumula");
var Categoria_1 = require("./entity/Categoria");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: "66.94.105.135",
    port: 3306,
    username: "fsd0043",
    password: "FleekPass@2023a",
    database: "fsd0043_francoso",
    synchronize: true,
    // tudo que vier diferente ele dropa e coloca os dados
    logging: true,
    entities: [Atleta_1.default, Raca_1.default, Cao_1.default, Campeonato_1.default, Inscricao_1.default, Prova_1.default, Sumula_1.default, Categoria_1.default],
    migrations: [],
    subscribers: [],
});
//# sourceMappingURL=data-source.js.map