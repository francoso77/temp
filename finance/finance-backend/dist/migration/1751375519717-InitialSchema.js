"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialSchema1751375519717 = void 0;
var typeorm_1 = require("typeorm");
var InitialSchema1751375519717 = /** @class */ (function () {
    function InitialSchema1751375519717() {
    }
    InitialSchema1751375519717.prototype.up = function (queryRunner) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Tabela 'user' (assumindo estrutura básica com UUID como PK)
                    return [4 /*yield*/, queryRunner.createTable(new typeorm_1.Table({
                            name: "users",
                            columns: [
                                {
                                    name: "id",
                                    type: "varchar",
                                    length: "36",
                                    isPrimary: true,
                                    isNullable: false,
                                },
                                {
                                    name: "name",
                                    type: "varchar",
                                    length: "255",
                                    isNullable: false,
                                },
                                {
                                    name: "email",
                                    type: "varchar",
                                    length: "255",
                                    isUnique: true,
                                    isNullable: false,
                                },
                                {
                                    name: "password",
                                    type: "varchar",
                                    length: "255",
                                    isNullable: false,
                                },
                                {
                                    name: "createdAt",
                                    type: "timestamp",
                                    default: "CURRENT_TIMESTAMP",
                                    isNullable: false,
                                },
                                {
                                    name: "updatedAt",
                                    type: "timestamp",
                                    default: "CURRENT_TIMESTAMP",
                                    onUpdate: "CURRENT_TIMESTAMP",
                                    isNullable: false,
                                },
                            ]
                        }), true)];
                    case 1:
                        // Tabela 'user' (assumindo estrutura básica com UUID como PK)
                        _a.sent();
                        // Tabela 'usersectons'
                        return [4 /*yield*/, queryRunner.createTable(new typeorm_1.Table({
                                name: "usersectons",
                                columns: [
                                    {
                                        name: "id",
                                        type: "varchar",
                                        length: "36",
                                        isPrimary: true,
                                        isNullable: false,
                                    },
                                    {
                                        name: "userId",
                                        type: "varchar",
                                        length: "36",
                                        isNullable: false,
                                    },
                                    {
                                        name: "token",
                                        type: "varchar",
                                        length: "255",
                                        isNullable: false,
                                    },
                                    {
                                        name: "isActive",
                                        type: "boolean",
                                        default: false,
                                        isNullable: false,
                                    },
                                    {
                                        name: "createdAt",
                                        type: "timestamp",
                                        default: "CURRENT_TIMESTAMP",
                                        isNullable: false,
                                    },
                                    {
                                        name: "updatedAt",
                                        type: "timestamp",
                                        default: "CURRENT_TIMESTAMP",
                                        onUpdate: "CURRENT_TIMESTAMP",
                                        isNullable: false,
                                    },
                                ]
                            }), true)];
                    case 2:
                        // Tabela 'usersectons'
                        _a.sent();
                        // Tabela 'accounts'
                        return [4 /*yield*/, queryRunner.createTable(new typeorm_1.Table({
                                name: "accounts",
                                columns: [
                                    {
                                        name: "id",
                                        type: "varchar",
                                        length: "36",
                                        isPrimary: true,
                                        isNullable: false,
                                    },
                                    {
                                        name: "name",
                                        type: "varchar",
                                        length: "255",
                                        isNullable: false,
                                    },
                                    {
                                        name: "type",
                                        type: "varchar",
                                        length: "255", // Para tipos de enum como 'corrente' | 'poupanca'
                                        isNullable: false,
                                    },
                                    {
                                        name: "initialBalance",
                                        type: "decimal",
                                        precision: 10,
                                        scale: 2,
                                        default: 0,
                                        isNullable: false,
                                    },
                                    {
                                        name: "color",
                                        type: "varchar",
                                        length: "255",
                                        isNullable: false,
                                    },
                                    {
                                        name: "isDefault",
                                        type: "boolean",
                                        default: false,
                                        isNullable: false,
                                    },
                                    {
                                        name: "createdAt",
                                        type: "timestamp",
                                        default: "CURRENT_TIMESTAMP",
                                        isNullable: false,
                                    },
                                    {
                                        name: "updatedAt",
                                        type: "timestamp",
                                        default: "CURRENT_TIMESTAMP",
                                        onUpdate: "CURRENT_TIMESTAMP",
                                        isNullable: false,
                                    },
                                    {
                                        name: "userId",
                                        type: "varchar",
                                        length: "36",
                                        isNullable: false,
                                    },
                                ]
                            }), true)];
                    case 3:
                        // Tabela 'accounts'
                        _a.sent();
                        return [4 /*yield*/, queryRunner.createIndex("accounts", new typeorm_1.TableIndex({
                                columnNames: ["name"]
                            }))];
                    case 4:
                        _a.sent();
                        // Tabela 'categorys'
                        return [4 /*yield*/, queryRunner.createTable(new typeorm_1.Table({
                                name: "categorys",
                                columns: [
                                    {
                                        name: "id",
                                        type: "varchar",
                                        length: "36",
                                        isPrimary: true,
                                        isNullable: false,
                                    },
                                    {
                                        name: "name",
                                        type: "varchar",
                                        length: "80",
                                        isNullable: false,
                                    },
                                    {
                                        name: "type",
                                        type: "varchar",
                                        length: "255", // Para tipos de enum como 'Receita' | 'Despesa'
                                        isNullable: false,
                                    },
                                    {
                                        name: "color",
                                        type: "varchar",
                                        length: "255",
                                        isNullable: false,
                                    },
                                    {
                                        name: "createdAt",
                                        type: "timestamp",
                                        default: "CURRENT_TIMESTAMP",
                                        isNullable: false,
                                    },
                                    {
                                        name: "updatedAt",
                                        type: "timestamp",
                                        default: "CURRENT_TIMESTAMP",
                                        onUpdate: "CURRENT_TIMESTAMP",
                                        isNullable: false,
                                    },
                                    {
                                        name: "userId",
                                        type: "varchar",
                                        length: "36",
                                        isNullable: false,
                                    },
                                ]
                            }), true)];
                    case 5:
                        // Tabela 'categorys'
                        _a.sent();
                        return [4 /*yield*/, queryRunner.createIndex("categorys", new typeorm_1.TableIndex({
                                columnNames: ["name"]
                            }))];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.createIndex("categorys", new typeorm_1.TableIndex({
                                name: "IDX_CATEGORY_USERID_NAME", // Nome para o índice único
                                columnNames: ["userId", "name"],
                                isUnique: true
                            }))];
                    case 7:
                        _a.sent();
                        // Tabela 'companies' 
                        return [4 /*yield*/, queryRunner.createTable(new typeorm_1.Table({
                                name: "companies",
                                columns: [
                                    {
                                        name: "id",
                                        type: "varchar",
                                        length: "36",
                                        isPrimary: true,
                                        isNullable: false,
                                    },
                                    {
                                        name: "name",
                                        type: "varchar",
                                        length: "100",
                                        isNullable: false,
                                    },
                                    {
                                        name: "createdAt",
                                        type: "timestamp",
                                        default: "CURRENT_TIMESTAMP",
                                        isNullable: false,
                                    },
                                    {
                                        name: "updatedAt",
                                        type: "timestamp",
                                        default: "CURRENT_TIMESTAMP",
                                        onUpdate: "CURRENT_TIMESTAMP",
                                        isNullable: false,
                                    },
                                    {
                                        name: "userId",
                                        type: "varchar",
                                        length: "36",
                                        isNullable: false,
                                    },
                                ]
                            }), true)];
                    case 8:
                        // Tabela 'companies' 
                        _a.sent();
                        return [4 /*yield*/, queryRunner.createIndex("companies", new typeorm_1.TableIndex({
                                name: "IDX_COMPANY_USERID_NAME", // Nome para o índice único
                                columnNames: ["userId", "name"],
                                isUnique: true
                            }))];
                    case 9:
                        _a.sent();
                        // Tabela 'sectors' 
                        return [4 /*yield*/, queryRunner.createTable(new typeorm_1.Table({
                                name: "sectors",
                                columns: [
                                    {
                                        name: "id",
                                        type: "varchar",
                                        length: "36",
                                        isPrimary: true,
                                        isNullable: false,
                                    },
                                    {
                                        name: "name",
                                        type: "varchar",
                                        length: "60",
                                        isNullable: false,
                                    },
                                    {
                                        name: "createdAt",
                                        type: "timestamp",
                                        default: "CURRENT_TIMESTAMP",
                                        isNullable: false,
                                    },
                                    {
                                        name: "updatedAt",
                                        type: "timestamp",
                                        default: "CURRENT_TIMESTAMP",
                                        onUpdate: "CURRENT_TIMESTAMP",
                                        isNullable: false,
                                    },
                                    {
                                        name: "userId",
                                        type: "varchar",
                                        length: "36",
                                        isNullable: false,
                                    },
                                ]
                            }), true)];
                    case 10:
                        // Tabela 'sectors' 
                        _a.sent();
                        return [4 /*yield*/, queryRunner.createIndex("sectors", new typeorm_1.TableIndex({
                                name: "IDX_SECTOR_USERID_NAME", // Nome para o índice único
                                columnNames: ["userId", "name"],
                                isUnique: true
                            }))];
                    case 11:
                        _a.sent();
                        // Tabela 'transactions'
                        return [4 /*yield*/, queryRunner.createTable(new typeorm_1.Table({
                                name: "transactions",
                                columns: [
                                    {
                                        name: "id",
                                        type: "varchar",
                                        length: "36",
                                        isPrimary: true,
                                        isNullable: false,
                                    },
                                    {
                                        name: "description",
                                        type: "varchar",
                                        length: "100",
                                        isNullable: false,
                                    },
                                    {
                                        name: "amount",
                                        type: "decimal",
                                        precision: 12,
                                        scale: 4,
                                        default: 0,
                                        isNullable: false,
                                    },
                                    {
                                        name: "qtd",
                                        type: "decimal",
                                        precision: 12,
                                        scale: 4,
                                        default: 0,
                                        isNullable: false,
                                    },
                                    {
                                        name: "price",
                                        type: "decimal",
                                        precision: 12,
                                        scale: 4,
                                        default: 0,
                                        isNullable: false,
                                    },
                                    {
                                        name: "sectorId",
                                        type: "varchar",
                                        length: "36",
                                        isNullable: false,
                                    },
                                    {
                                        name: "categoryId",
                                        type: "varchar",
                                        length: "36",
                                        isNullable: false,
                                    },
                                    {
                                        name: "accountId",
                                        type: "varchar",
                                        length: "36",
                                        isNullable: false,
                                    },
                                    {
                                        name: "companyId",
                                        type: "varchar",
                                        length: "36",
                                        isNullable: false,
                                    },
                                    {
                                        name: "date",
                                        type: "datetime",
                                        isNullable: false,
                                    },
                                    {
                                        name: "createdAt",
                                        type: "timestamp",
                                        default: "CURRENT_TIMESTAMP",
                                        isNullable: false,
                                    },
                                    {
                                        name: "updatedAt",
                                        type: "timestamp",
                                        default: "CURRENT_TIMESTAMP",
                                        onUpdate: "CURRENT_TIMESTAMP",
                                        isNullable: false,
                                    },
                                    {
                                        name: "userId",
                                        type: "varchar",
                                        length: "36",
                                        isNullable: false,
                                    },
                                ]
                            }), true)];
                    case 12:
                        // Tabela 'transactions'
                        _a.sent();
                        return [4 /*yield*/, queryRunner.createIndex("transactions", new typeorm_1.TableIndex({
                                columnNames: ["date", "description"]
                            }))];
                    case 13:
                        _a.sent();
                        // Adicionando chaves estrangeiras
                        return [4 /*yield*/, queryRunner.createForeignKey("usersectons", new typeorm_1.TableForeignKey({
                                columnNames: ["userId"],
                                referencedColumnNames: ["id"],
                                referencedTableName: "users",
                                onDelete: "CASCADE",
                            }))];
                    case 14:
                        // Adicionando chaves estrangeiras
                        _a.sent();
                        return [4 /*yield*/, queryRunner.createForeignKey("accounts", new typeorm_1.TableForeignKey({
                                columnNames: ["userId"],
                                referencedColumnNames: ["id"],
                                referencedTableName: "users",
                                onDelete: "CASCADE",
                            }))];
                    case 15:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.createForeignKey("categorys", new typeorm_1.TableForeignKey({
                                columnNames: ["userId"],
                                referencedColumnNames: ["id"],
                                referencedTableName: "users",
                                onDelete: "CASCADE",
                            }))];
                    case 16:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.createForeignKey("companies", new typeorm_1.TableForeignKey({
                                columnNames: ["userId"],
                                referencedColumnNames: ["id"],
                                referencedTableName: "users",
                                onDelete: "CASCADE",
                            }))];
                    case 17:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.createForeignKey("sectors", new typeorm_1.TableForeignKey({
                                columnNames: ["userId"],
                                referencedColumnNames: ["id"],
                                referencedTableName: "users",
                                onDelete: "CASCADE",
                            }))];
                    case 18:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.createForeignKey("transactions", new typeorm_1.TableForeignKey({
                                columnNames: ["sectorId"],
                                referencedColumnNames: ["id"],
                                referencedTableName: "sectors",
                                onDelete: "RESTRICT",
                            }))];
                    case 19:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.createForeignKey("transactions", new typeorm_1.TableForeignKey({
                                columnNames: ["categoryId"],
                                referencedColumnNames: ["id"],
                                referencedTableName: "categorys",
                                onDelete: "RESTRICT",
                            }))];
                    case 20:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.createForeignKey("transactions", new typeorm_1.TableForeignKey({
                                columnNames: ["accountId"],
                                referencedColumnNames: ["id"],
                                referencedTableName: "accounts",
                                onDelete: "RESTRICT",
                            }))];
                    case 21:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.createForeignKey("transactions", new typeorm_1.TableForeignKey({
                                columnNames: ["companyId"],
                                referencedColumnNames: ["id"],
                                referencedTableName: "companies",
                                onDelete: "RESTRICT",
                            }))];
                    case 22:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.createForeignKey("transactions", new typeorm_1.TableForeignKey({
                                columnNames: ["userId"],
                                referencedColumnNames: ["id"],
                                referencedTableName: "users",
                                onDelete: "CASCADE",
                            }))];
                    case 23:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    InitialSchema1751375519717.prototype.down = function (queryRunner) {
        return __awaiter(this, void 0, void 0, function () {
            var transactionsTable, foreignKeyTransactionSector, foreignKeyTransactionCategory, foreignKeyTransactionAccount, foreignKeyTransactionCompany, foreignKeyTransactionUser, userSectionTable, foreignKeyUserSectionUser, accountsTable, foreignKeyAccountUser, categorysTable, foreignKeyCategoryUser, companiesTable, foreignKeyCompanyUser, sectorsTable, foreignKeySectorUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, queryRunner.getTable("transactions")];
                    case 1:
                        transactionsTable = _a.sent();
                        if (!transactionsTable) return [3 /*break*/, 11];
                        foreignKeyTransactionSector = transactionsTable.foreignKeys.find(function (fk) { return fk.columnNames.includes("sectorId"); });
                        if (!foreignKeyTransactionSector) return [3 /*break*/, 3];
                        return [4 /*yield*/, queryRunner.dropForeignKey("transactions", foreignKeyTransactionSector)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        foreignKeyTransactionCategory = transactionsTable.foreignKeys.find(function (fk) { return fk.columnNames.includes("categoryId"); });
                        if (!foreignKeyTransactionCategory) return [3 /*break*/, 5];
                        return [4 /*yield*/, queryRunner.dropForeignKey("transactions", foreignKeyTransactionCategory)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        foreignKeyTransactionAccount = transactionsTable.foreignKeys.find(function (fk) { return fk.columnNames.includes("accountId"); });
                        if (!foreignKeyTransactionAccount) return [3 /*break*/, 7];
                        return [4 /*yield*/, queryRunner.dropForeignKey("transactions", foreignKeyTransactionAccount)];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7:
                        foreignKeyTransactionCompany = transactionsTable.foreignKeys.find(function (fk) { return fk.columnNames.includes("companyId"); });
                        if (!foreignKeyTransactionCompany) return [3 /*break*/, 9];
                        return [4 /*yield*/, queryRunner.dropForeignKey("transactions", foreignKeyTransactionCompany)];
                    case 8:
                        _a.sent();
                        _a.label = 9;
                    case 9:
                        foreignKeyTransactionUser = transactionsTable.foreignKeys.find(function (fk) { return fk.columnNames.includes("userId"); });
                        if (!foreignKeyTransactionUser) return [3 /*break*/, 11];
                        return [4 /*yield*/, queryRunner.dropForeignKey("transactions", foreignKeyTransactionUser)];
                    case 10:
                        _a.sent();
                        _a.label = 11;
                    case 11: return [4 /*yield*/, queryRunner.getTable("usersectons")];
                    case 12:
                        userSectionTable = _a.sent();
                        if (!userSectionTable) return [3 /*break*/, 14];
                        foreignKeyUserSectionUser = userSectionTable.foreignKeys.find(function (fk) { return fk.columnNames.includes("userId"); });
                        if (!foreignKeyUserSectionUser) return [3 /*break*/, 14];
                        return [4 /*yield*/, queryRunner.dropForeignKey("usersectons", foreignKeyUserSectionUser)];
                    case 13:
                        _a.sent();
                        _a.label = 14;
                    case 14: return [4 /*yield*/, queryRunner.getTable("accounts")];
                    case 15:
                        accountsTable = _a.sent();
                        if (!accountsTable) return [3 /*break*/, 17];
                        foreignKeyAccountUser = accountsTable.foreignKeys.find(function (fk) { return fk.columnNames.includes("userId"); });
                        if (!foreignKeyAccountUser) return [3 /*break*/, 17];
                        return [4 /*yield*/, queryRunner.dropForeignKey("accounts", foreignKeyAccountUser)];
                    case 16:
                        _a.sent();
                        _a.label = 17;
                    case 17: return [4 /*yield*/, queryRunner.getTable("categorys")];
                    case 18:
                        categorysTable = _a.sent();
                        if (!categorysTable) return [3 /*break*/, 20];
                        foreignKeyCategoryUser = categorysTable.foreignKeys.find(function (fk) { return fk.columnNames.includes("userId"); });
                        if (!foreignKeyCategoryUser) return [3 /*break*/, 20];
                        return [4 /*yield*/, queryRunner.dropForeignKey("categorys", foreignKeyCategoryUser)];
                    case 19:
                        _a.sent();
                        _a.label = 20;
                    case 20: return [4 /*yield*/, queryRunner.getTable("companies")];
                    case 21:
                        companiesTable = _a.sent();
                        if (!companiesTable) return [3 /*break*/, 23];
                        foreignKeyCompanyUser = companiesTable.foreignKeys.find(function (fk) { return fk.columnNames.includes("userId"); });
                        if (!foreignKeyCompanyUser) return [3 /*break*/, 23];
                        return [4 /*yield*/, queryRunner.dropForeignKey("companies", foreignKeyCompanyUser)];
                    case 22:
                        _a.sent();
                        _a.label = 23;
                    case 23: return [4 /*yield*/, queryRunner.getTable("sectors")];
                    case 24:
                        sectorsTable = _a.sent();
                        if (!sectorsTable) return [3 /*break*/, 26];
                        foreignKeySectorUser = sectorsTable.foreignKeys.find(function (fk) { return fk.columnNames.includes("userId"); });
                        if (!foreignKeySectorUser) return [3 /*break*/, 26];
                        return [4 /*yield*/, queryRunner.dropForeignKey("sectors", foreignKeySectorUser)];
                    case 25:
                        _a.sent();
                        _a.label = 26;
                    case 26: 
                    // Removendo tabelas (ordem inversa da criação, após remover FKs)
                    return [4 /*yield*/, queryRunner.dropTable("transactions")];
                    case 27:
                        // Removendo tabelas (ordem inversa da criação, após remover FKs)
                        _a.sent();
                        return [4 /*yield*/, queryRunner.dropTable("usersectons")];
                    case 28:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.dropTable("accounts")];
                    case 29:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.dropTable("categorys")];
                    case 30:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.dropTable("companies")];
                    case 31:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.dropTable("sectors")];
                    case 32:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.dropTable("users")];
                    case 33:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return InitialSchema1751375519717;
}());
exports.InitialSchema1751375519717 = InitialSchema1751375519717;
//# sourceMappingURL=1751375519717-InitialSchema.js.map