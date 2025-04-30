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
var data_source_1 = require("../data-source");
var grupoPermissao_entity_1 = require("../entities/sistema/grupoPermissao.entity");
var modulo_entity_1 = require("../entities/sistema/modulo.entity");
var moduloPermissao_entity_1 = require("../entities/sistema/moduloPermissao.entity");
var SQL_PERMISSAO = "\n    SELECT grpe.idModuloPermissao FROM gruposusuarios AS grus\n    INNER JOIN grupospermissoes AS grpe\n    ON grus.idGrupo = grpe.idGrupo\n    WHERE grus.idUsuario = ? AND grpe.idModuloPermissao = ?\n    UNION ALL\n    SELECT uspe.idModuloPermissao FROM usuariospermissoes AS uspe\n    WHERE uspe.idUsuario = ? AND uspe.idModuloPermissao = ?;\n";
var ClsAcesso = /** @class */ (function () {
    function ClsAcesso() {
    }
    ClsAcesso.prototype.checarAcesso = function (idUsuario, modulo, permissao) {
        return __awaiter(this, void 0, void 0, function () {
            var idModuloPermissao, rsPermissao;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(idUsuario && idUsuario > 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.pesquisarIdModuloPermissao(modulo, permissao)];
                    case 1:
                        idModuloPermissao = _a.sent();
                        return [4 /*yield*/, data_source_1.AppDataSource.query(SQL_PERMISSAO, [idUsuario, idModuloPermissao, idUsuario, idModuloPermissao])];
                    case 2:
                        rsPermissao = _a.sent();
                        if (rsPermissao && rsPermissao.length > 0) {
                            return [2 /*return*/, true];
                        }
                        else {
                            return [2 /*return*/, false];
                        }
                        return [3 /*break*/, 4];
                    case 3: return [2 /*return*/, Promise.resolve(false)];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ClsAcesso.prototype.pesquisarIdModuloPermissao = function (modulo, permissao) {
        return __awaiter(this, void 0, void 0, function () {
            var idModulo, rsModuloPermissao;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pesquisarIdModulo(modulo)];
                    case 1:
                        idModulo = _a.sent();
                        return [4 /*yield*/, data_source_1.AppDataSource.getRepository(moduloPermissao_entity_1.ModuloPermissao).findOne({ where: { idModulo: idModulo, permissao: permissao } })];
                    case 2:
                        rsModuloPermissao = _a.sent();
                        if (rsModuloPermissao && rsModuloPermissao.idModuloPermissao) {
                            return [2 /*return*/, rsModuloPermissao.idModuloPermissao];
                        }
                        else {
                            return [2 /*return*/, data_source_1.AppDataSource.getRepository(moduloPermissao_entity_1.ModuloPermissao).save({ idModulo: idModulo, permissao: permissao }).then(function (moduloPermissao) {
                                    if (process.env.ID_GRUPO_ADMINISTRADOR) {
                                        return data_source_1.AppDataSource.getRepository(grupoPermissao_entity_1.GrupoPermissao).save({
                                            idGrupo: parseInt(process.env.ID_GRUPO_ADMINISTRADOR),
                                            idModuloPermissao: moduloPermissao.idModuloPermissao
                                        }).then(function () {
                                            return moduloPermissao.idModuloPermissao;
                                        });
                                    }
                                    else {
                                        return moduloPermissao.idModuloPermissao;
                                    }
                                })];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ClsAcesso.prototype.pesquisarIdModulo = function (modulo) {
        return __awaiter(this, void 0, void 0, function () {
            var rsModulo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, data_source_1.AppDataSource.getRepository(modulo_entity_1.Modulo).findOne({ where: { modulo: modulo } })];
                    case 1:
                        rsModulo = _a.sent();
                        if (rsModulo && rsModulo.idModulo) {
                            return [2 /*return*/, rsModulo.idModulo];
                        }
                        else {
                            return [2 /*return*/, data_source_1.AppDataSource.getRepository(modulo_entity_1.Modulo).save({ modulo: modulo }).then(function (modulo) {
                                    return modulo.idModulo;
                                })];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return ClsAcesso;
}());
exports.default = ClsAcesso;
//# sourceMappingURL=acesso.cls.js.map