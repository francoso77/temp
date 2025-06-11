"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var typeorm_1 = require("typeorm");
var data_source_1 = require("../data-source");
var ClsCrudController = /** @class */ (function () {
    function ClsCrudController() {
    }
    ClsCrudController.prototype.incluirComDetalhe = function (master, entidadeMaster, detalhes, entidadeDetalhe, id) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, data_source_1.AppDataSource.transaction(function (entity) { return __awaiter(_this, void 0, void 0, function () {
                        var newMaster;
                        return __generator(this, function (_a) {
                            newMaster = entity.save(entidadeMaster, master);
                            detalhes.forEach(function (detalhe) { return detalhe[id] = newMaster[id]; });
                            entity.save(entidadeDetalhe, detalhes);
                            return [2 /*return*/];
                        });
                    }); })
                        .then(function (rs) {
                        return {
                            ok: true,
                            mensagem: "Registro salvo com Sucesso.",
                            dados: rs,
                        };
                    })
                        .catch(function (e) {
                        return {
                            ok: false,
                            mensagem: e.message,
                        };
                    })];
            });
        });
    };
    ClsCrudController.prototype.incluir = function (criterio, entidade) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, data_source_1.AppDataSource.getRepository(entidade)
                        .save(criterio)
                        .then(function (rs) {
                        return {
                            ok: true,
                            mensagem: "Registro Salvo com sucesso.",
                            dados: rs,
                        };
                    })
                        .catch(function (e) {
                        return {
                            ok: false,
                            mensagem: e.message,
                        };
                    })];
            });
        });
    };
    ClsCrudController.prototype.query = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var repositorio;
            var entidade = _b.entidade, sql = _b.sql;
            return __generator(this, function (_c) {
                repositorio = data_source_1.AppDataSource.getRepository(entidade);
                return [2 /*return*/, repositorio.query(sql)
                        .then(function (rs) {
                        return {
                            ok: true,
                            mensagem: 'Pesquisa Concluída',
                            dados: rs
                        };
                    })];
            });
        });
    };
    ClsCrudController.prototype.pesquisar = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var where, order;
            var entidade = _b.entidade, criterio = _b.criterio, camposLike = _b.camposLike, select = _b.select, _c = _b.relations, relations = _c === void 0 ? [] : _c, campoOrder = _b.campoOrder, comparador = _b.comparador, tipoOrder = _b.tipoOrder;
            return __generator(this, function (_d) {
                where = {};
                where = __assign({}, criterio);
                //"N" | "L" | "I" | "=" | ">" | "<" | ">=" | "<=" | "!=" 
                camposLike.forEach(function (campo) {
                    if (comparador === "L") {
                        where[campo] = (0, typeorm_1.Like)(where[campo]);
                    }
                    else if (comparador === "N") {
                        where[campo] = (0, typeorm_1.Not)(where[campo]);
                    }
                    else if (comparador === "I") {
                        where[campo] = (0, typeorm_1.In)(where[campo]);
                    }
                    else if (comparador === "=") {
                        where[campo] = (where[campo]);
                    }
                    else if (comparador === ">") {
                        where[campo] = (0, typeorm_1.MoreThan)(where[campo]);
                    }
                    else if (comparador === ">=") {
                        where[campo] = (0, typeorm_1.MoreThanOrEqual)(where[campo]);
                    }
                    else if (comparador === "<") {
                        where[campo] = (0, typeorm_1.LessThan)(where[campo]);
                    }
                    else if (comparador === "<=") {
                        where[campo] = (0, typeorm_1.LessThanOrEqual)(where[campo]);
                    }
                });
                order = {};
                campoOrder.forEach(function (campo) {
                    order[campo] = tipoOrder;
                });
                return [2 /*return*/, data_source_1.AppDataSource.getRepository(entidade)
                        .find({
                        where: where,
                        select: select,
                        relations: relations,
                        order: order
                    })
                        .then(function (rs) {
                        return {
                            ok: true,
                            mensagem: 'Pesquisa Concluída',
                            dados: rs
                        };
                    })];
            });
        });
    };
    ClsCrudController.prototype.excluir = function (criterio, entidade) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, data_source_1.AppDataSource.getRepository(entidade).delete(criterio)
                        .then(function (rs) {
                        if (rs.affected === 0) {
                            return {
                                ok: true,
                                mensagem: "Registro não encontrado.",
                                dados: rs,
                            };
                        }
                        return {
                            ok: true,
                            mensagem: "Registro Deletado.",
                            dados: rs,
                        };
                    })
                        .catch(function (e) {
                        return {
                            ok: false,
                            mensagem: e.message,
                        };
                    })];
            });
        });
    };
    ClsCrudController.prototype.consultar = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var where_1, order_1, repository, queryBuilder_1, resultado, error_1;
            var entidade = _b.entidade, joins = _b.joins, criterio = _b.criterio, camposLike = _b.camposLike, select = _b.select, campoOrder = _b.campoOrder, comparador = _b.comparador, groupBy = _b.groupBy, having = _b.having, tipoOrder = _b.tipoOrder;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        where_1 = {};
                        where_1 = __assign({}, criterio);
                        camposLike.forEach(function (campo) {
                            if (comparador === "L") {
                                where_1[campo] = (0, typeorm_1.Like)(where_1[campo]);
                            }
                            else if (comparador === "N") {
                                where_1[campo] = (0, typeorm_1.Not)(where_1[campo]);
                            }
                            else {
                                where_1[campo] = (0, typeorm_1.In)(where_1[campo]);
                            }
                        });
                        order_1 = {};
                        campoOrder.forEach(function (campo) {
                            order_1[campo] = tipoOrder;
                        });
                        repository = data_source_1.AppDataSource.getRepository(entidade);
                        queryBuilder_1 = repository.createQueryBuilder(entidade.toLowerCase());
                        joins.forEach(function (join) {
                            queryBuilder_1 = queryBuilder_1.leftJoinAndSelect(join.tabelaRelacao, join.relacao);
                        });
                        queryBuilder_1 = queryBuilder_1
                            .select(select)
                            .where(where_1)
                            .groupBy(groupBy)
                            .having(having)
                            .orderBy(order_1);
                        return [4 /*yield*/, queryBuilder_1.getRawMany()];
                    case 1:
                        resultado = _c.sent();
                        return [2 /*return*/, {
                                ok: true,
                                mensagem: 'Pesquisa Concluída',
                                dados: resultado
                            }];
                    case 2:
                        error_1 = _c.sent();
                        console.error("Erro na consulta: ", error_1);
                        return [2 /*return*/, {
                                ok: false,
                                mensagem: 'Erro na pesquisa',
                                dados: null
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return ClsCrudController;
}());
exports.default = ClsCrudController;
//# sourceMappingURL=crud.controller.cls.js.map