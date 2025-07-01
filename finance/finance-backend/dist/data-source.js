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
var isCompiled = __dirname.includes('dist');
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: 'mysql',
    port: 3306,
    username: 'root',
    password: 'Frk@071569#',
    database: 'finance',
    synchronize: false,
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