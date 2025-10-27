"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
var typeorm_1 = require("typeorm");
var user_1 = require("./entity/sistema/user");
var userSection_1 = require("./entity/sistema/userSection");
var dotenv = require("dotenv");
var produto_1 = require("./entity/produto");
var categoria_1 = require("./entity/categoria");
var cliente_1 = require("./entity/cliente");
var pedido_1 = require("./entity/pedido");
var detalhePedido_1 = require("./entity/detalhePedido");
var notification_1 = require("./entity/notification");
dotenv.config();
var isCompiled = __dirname.includes('dist');
exports.AppDataSource = new typeorm_1.DataSource({
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: true,
    logging: false,
    entities: [
        user_1.User,
        userSection_1.UserSection,
        produto_1.default,
        categoria_1.default,
        cliente_1.default,
        pedido_1.default,
        detalhePedido_1.default,
        notification_1.Notificacao
    ],
    //migrations: [__dirname + (isCompiled ? '/migration/*.js' : '/migration/*.ts')],
    subscribers: [],
});
//# sourceMappingURL=data-source.js.map