"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
var typeorm_1 = require("typeorm");
var user_1 = require("./entity/sistema/user");
var userSection_1 = require("./entity/sistema/userSection");
var account_1 = require("./entity/account");
var category_1 = require("./entity/category");
var company_1 = require("./entity/company");
var transaction_1 = require("./entity/transaction");
var sector_1 = require("./entity/sector");
var dotenv = require("dotenv");
dotenv.config();
var isCompiled = __dirname.includes('dist');
exports.AppDataSource = new typeorm_1.DataSource({
    type: process.env.DB_TYPE || "mysql",
    host: process.env.DB_HOST || "127.0.0.1",
    port: parseInt(process.env.DB_PORT || "3306", 10),
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "Frk@071569#",
    database: process.env.DB_DATABASE || "finance",
    synchronize: true,
    logging: false,
    entities: [
        user_1.User,
        userSection_1.UserSection,
        account_1.default,
        category_1.default,
        company_1.default,
        transaction_1.default,
        sector_1.default
    ],
    migrations: [__dirname + (isCompiled ? '/migration/*.js' : '/migration/*.ts')],
    subscribers: [],
});
//# sourceMappingURL=data-source.js.map