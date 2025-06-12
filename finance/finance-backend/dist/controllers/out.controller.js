"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.OutController = void 0;
var common_1 = require("@nestjs/common");
var data_source_1 = require("../data-source");
var account_1 = require("../entity/account");
var transaction_1 = require("../entity/transaction");
var OutController = /** @class */ (function () {
    function OutController() {
    }
    OutController.prototype.alterarPadrao = function (idUsuario) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, data_source_1.AppDataSource
                                .getRepository(account_1.default)
                                .update({ isDefault: true, userId: idUsuario }, { isDefault: false })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, { success: true, affected: result.affected }];
                    case 2:
                        error_1 = _a.sent();
                        return [2 /*return*/, { success: false, error: error_1 }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OutController.prototype.selecaoTransacoes = function (setor, categoria, conta, dtInicial, dtFinal, idUsuario) {
        return __awaiter(this, void 0, void 0, function () {
            var query, transacoes, accountRepo, account;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = data_source_1.AppDataSource.getRepository(transaction_1.default)
                            .createQueryBuilder('t')
                            .leftJoinAndSelect('t.account', 'account')
                            .leftJoinAndSelect('t.category', 'category')
                            .leftJoinAndSelect('t.company', 'company')
                            .leftJoinAndSelect('t.sector', 'sector') // novo join com a tabela setor
                            .select([
                            't.id',
                            't.date',
                            't.amount',
                            't.description',
                            't.userId',
                            'category.id',
                            'category.name',
                            'category.color',
                            'category.type',
                            'account.id',
                            'account.name',
                            'account.initialBalance',
                            'company.id',
                            'company.name',
                            'sector.id',
                            'sector.name'
                        ]);
                        if (dtInicial && dtFinal) {
                            query.andWhere('t.date BETWEEN :start AND :end', {
                                start: dtInicial,
                                end: dtFinal,
                            });
                        }
                        if (setor) {
                            query.andWhere('t.sectorId = :setorParam', { setorParam: setor });
                        }
                        if (categoria) {
                            query.andWhere('t.categoryId = :categoriaParam', { categoriaParam: categoria });
                        }
                        if (conta) {
                            query.andWhere('t.accountId = :contaParam', { contaParam: conta });
                        }
                        if (idUsuario) {
                            query.andWhere('t.userId = :idUsuarioParam', { idUsuarioParam: idUsuario });
                        }
                        return [4 /*yield*/, query.getMany()];
                    case 1:
                        transacoes = _a.sent();
                        if (!(transacoes.length === 0 && conta)) return [3 /*break*/, 3];
                        accountRepo = data_source_1.AppDataSource.getRepository('Account');
                        return [4 /*yield*/, accountRepo.findOne({
                                where: { id: conta },
                                select: ['id', 'name', 'initialBalance'],
                            })];
                    case 2:
                        account = _a.sent();
                        if (account) {
                            return [2 /*return*/, [{
                                        id: null,
                                        date: null,
                                        amount: null,
                                        description: 'Sem transações no período',
                                        category: { name: null, color: null, type: null },
                                        company: { name: null },
                                        sector: { name: null },
                                        account: {
                                            name: account.name,
                                            initialBalance: account.initialBalance,
                                        },
                                    }]];
                        }
                        _a.label = 3;
                    case 3: return [2 /*return*/, transacoes];
                }
            });
        });
    };
    __decorate([
        (0, common_1.Post)("alterarPadrao"),
        __param(0, (0, common_1.Body)("idUsuario")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], OutController.prototype, "alterarPadrao", null);
    __decorate([
        (0, common_1.Post)('selecaoTransacoes'),
        __param(0, (0, common_1.Body)('setor')),
        __param(1, (0, common_1.Body)('categoria')),
        __param(2, (0, common_1.Body)('conta')),
        __param(3, (0, common_1.Body)('dtInicial')),
        __param(4, (0, common_1.Body)('dtFinal')),
        __param(5, (0, common_1.Body)('idUsuario')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, String, String, String, String]),
        __metadata("design:returntype", Promise)
    ], OutController.prototype, "selecaoTransacoes", null);
    OutController = __decorate([
        (0, common_1.Controller)()
    ], OutController);
    return OutController;
}());
exports.OutController = OutController;
//# sourceMappingURL=out.controller.js.map