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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
        var entidade = _a.entidade, sql = _a.sql;
        return __awaiter(this, void 0, void 0, function () {
            var repositorio;
            return __generator(this, function (_b) {
                repositorio = data_source_1.AppDataSource.getRepository(entidade);
                // let where: Record<string, any> = {}
                // where = { ...criterio }
                // camposLike.forEach((campo) => {
                //   where[campo] = Like(where[campo])
                // })
                // console.log("where: ", where)
                // const rep = AppDataSource.getRepository(entidade)
                // const repository = AppDataSource.getRepository(entidade)
                // let queryBuilder = repository.createQueryBuilder(entidade.toLowerCase())
                // joins.forEach(join => {
                //   queryBuilder = queryBuilder.leftJoinAndSelect(join.tabelaRelacao, join.relacao)
                // })
                // queryBuilder = queryBuilder
                //   .select(select)
                //   .where(where)
                // const query = `
                //   SELECT 
                //       e.*,
                //       p.nome AS nomeProduto,
                //       tp.nome AS nomeTipoProduto
                //   FROM 
                //       estruturas e
                //   INNER JOIN 
                //       produtos p ON e.idProduto = p.idProduto
                //   INNER JOIN 
                //       tipoprodutos tp ON p.idTipoProduto = tp.idTipoProduto
                //   WHERE 
                //       p.nome LIKE '%%';
                //   `;
                return [2 /*return*/, repositorio.query(sql)
                        .then(function (rs) {
                        console.log(rs);
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
        var entidade = _a.entidade, criterio = _a.criterio, camposLike = _a.camposLike, select = _a.select, _b = _a.relations, relations = _b === void 0 ? [] : _b;
        return __awaiter(this, void 0, void 0, function () {
            var where;
            return __generator(this, function (_c) {
                where = {};
                where = __assign({}, criterio);
                camposLike.forEach(function (campo) {
                    where[campo] = (0, typeorm_1.Like)(where[campo]);
                });
                return [2 /*return*/, data_source_1.AppDataSource.getRepository(entidade)
                        .find({
                        where: where,
                        select: select,
                        relations: relations,
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
    return ClsCrudController;
}());
exports.default = ClsCrudController;
//# sourceMappingURL=crud.controller.cls.js.map