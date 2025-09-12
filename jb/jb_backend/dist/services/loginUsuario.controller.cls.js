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
var usuario_entity_1 = require("../entities/sistema/usuario.entity");
var usuarioSessao_entity_1 = require("../entities/sistema/usuarioSessao.entity");
var uuid_1 = require("uuid");
var permissoesTypes_1 = require("../types/permissoesTypes");
var usuarioTypes_1 = require("../types/usuarioTypes");
var typeorm_1 = require("typeorm");
var SQL_PERMISSAO_POR_USUARIO = "\n    SELECT m.modulo, mp.permissao FROM modulospermissoes AS mp \n\n    INNER JOIN modulos AS m\n    ON mp.idModulo = m.idModulo\n\n    INNER JOIN \n    (\n    SELECT grpe.idModuloPermissao FROM gruposusuarios AS grus\n    INNER JOIN grupospermissoes AS grpe\n    ON grus.idGrupo = grpe.idGrupo\n    WHERE grus.idUsuario = ?\n    UNION ALL\n    SELECT uspe.idModuloPermissao FROM usuariospermissoes AS uspe\n    WHERE uspe.idUsuario = ?\n    ) AS permissoes\n    ON mp.idModuloPermissao = permissoes.idModuloPermissao\n";
var ClsLoginUsuarioController = /** @class */ (function () {
    function ClsLoginUsuarioController() {
    }
    ClsLoginUsuarioController.prototype.logout = function (cpf) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fecharSessoesEmAberto(cpf).then(function (rsUsuarioExistente) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!rsUsuarioExistente) return [3 /*break*/, 2];
                                    return [4 /*yield*/, data_source_1.AppDataSource.getRepository(usuario_entity_1.Usuario).update({ cpf: cpf }, { ativo: false })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/, {
                                            ok: true,
                                            mensagem: 'Usuário deslogado com sucesso.',
                                            dados: {
                                                idUsuario: 0,
                                                nomeUsuario: '',
                                                cpfUsuario: '',
                                                tipoUsuario: usuarioTypes_1.UsuarioType.default,
                                                permissoes: permissoesTypes_1.PermissoesTypes,
                                                token: '',
                                            }
                                        }];
                                case 2: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    ClsLoginUsuarioController.prototype.logar = function (cpf, senha) {
        return __awaiter(this, void 0, void 0, function () {
            var retorno;
            var _this = this;
            return __generator(this, function (_a) {
                retorno = {
                    ok: false,
                    mensagem: 'Usuário ou senha inválidos.',
                    dados: {
                        idUsuario: 0,
                        nomeUsuario: '',
                        cpfUsuario: '',
                        tipoUsuario: usuarioTypes_1.UsuarioType.default,
                        token: '',
                        permissoes: permissoesTypes_1.PermissoesTypes
                    }
                };
                return [2 /*return*/, this.fecharSessoesEmAberto(cpf).then(function (rsUsuarioExistente) {
                        if (rsUsuarioExistente) {
                            return data_source_1.AppDataSource.getRepository(usuario_entity_1.Usuario).findOne({ where: { cpf: cpf, senha: senha, tentativasLogin: (0, typeorm_1.LessThan)(4) } }).then(function (rsUsuarioLogado) {
                                if (rsUsuarioLogado) {
                                    var token_1 = (0, uuid_1.v4)();
                                    return data_source_1.AppDataSource.getRepository(usuario_entity_1.Usuario).update({ idUsuario: rsUsuarioLogado.idUsuario }, { tentativasLogin: 0 }).then(function () {
                                        return data_source_1.AppDataSource.getRepository(usuarioSessao_entity_1.UsuarioSessao).save({
                                            idUsuario: rsUsuarioLogado.idUsuario,
                                            ativo: true,
                                            token: token_1
                                        }).then(function () {
                                            console.log('token gerado no login: ', token_1);
                                            return _this.permissoesUsuario(rsUsuarioLogado.idUsuario).then(function (rsPermissoes) {
                                                return {
                                                    ok: true,
                                                    mensagem: 'Login efetuado com sucesso.',
                                                    dados: {
                                                        idUsuario: rsUsuarioLogado.idUsuario,
                                                        nomeUsuario: rsUsuarioLogado.nome,
                                                        cpfUsuario: rsUsuarioLogado.cpf,
                                                        tipoUsuario: rsUsuarioLogado.tipoUsuario,
                                                        token: token_1,
                                                        permissoes: rsPermissoes
                                                    }
                                                };
                                            });
                                        });
                                    });
                                }
                                else {
                                    return data_source_1.AppDataSource.getRepository(usuario_entity_1.Usuario).update({ cpf: cpf }, { tentativasLogin: function () { return "tentativasLogin + 1"; } }).then(function () {
                                        return retorno;
                                    });
                                }
                            });
                        }
                        else {
                            return retorno;
                        }
                    })];
            });
        });
    };
    ClsLoginUsuarioController.prototype.fecharSessoesEmAberto = function (cpf) {
        return __awaiter(this, void 0, void 0, function () {
            var rsUsuarioExistente;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, data_source_1.AppDataSource.getRepository(usuario_entity_1.Usuario).findOne({ where: { cpf: cpf } })];
                    case 1:
                        rsUsuarioExistente = _a.sent();
                        if (rsUsuarioExistente) {
                            return [2 /*return*/, data_source_1.AppDataSource.getRepository(usuarioSessao_entity_1.UsuarioSessao).update({ idUsuario: rsUsuarioExistente.idUsuario }, { ativo: false }).then(function () {
                                    return true;
                                })];
                        }
                        else {
                            return [2 /*return*/, false];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ClsLoginUsuarioController.prototype.updatePermissoesUsuario = function (idUsuario) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, data_source_1.AppDataSource.query(SQL_PERMISSAO_POR_USUARIO, [idUsuario, idUsuario]).then(function (rsPermissoes) {
                        console.log(rsPermissoes);
                        var retorno = JSON.parse(JSON.stringify(permissoesTypes_1.PermissoesTypes));
                        Object.keys(permissoesTypes_1.PermissoesTypes).forEach(function (keyModulo) {
                            var modulo = permissoesTypes_1.PermissoesTypes[keyModulo].MODULO;
                            Object.keys(permissoesTypes_1.PermissoesTypes[keyModulo].PERMISSOES).forEach(function (keyPermissao) {
                                var permissao = permissoesTypes_1.PermissoesTypes[keyModulo].PERMISSOES[keyPermissao];
                                //console.log(modulo, permissao);
                                if (rsPermissoes.findIndex(function (rs) { return rs.modulo === modulo && rs.permissao === permissao; }) < 0) {
                                    retorno[keyModulo].PERMISSOES[keyPermissao] = '';
                                }
                            });
                        });
                        return retorno;
                    })];
            });
        });
    };
    ClsLoginUsuarioController.prototype.permissoesUsuario = function (idUsuario) {
        return __awaiter(this, void 0, void 0, function () {
            var rsPermissoes, retorno;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, data_source_1.AppDataSource.query(SQL_PERMISSAO_POR_USUARIO, [idUsuario, idUsuario])];
                    case 1:
                        rsPermissoes = _a.sent();
                        retorno = JSON.parse(JSON.stringify(permissoesTypes_1.PermissoesTypes));
                        Object.keys(permissoesTypes_1.PermissoesTypes).forEach(function (keyModulo) {
                            var modulo = permissoesTypes_1.PermissoesTypes[keyModulo].MODULO;
                            Object.keys(permissoesTypes_1.PermissoesTypes[keyModulo].PERMISSOES).forEach(function (keyPermissao) {
                                var permissao = permissoesTypes_1.PermissoesTypes[keyModulo].PERMISSOES[keyPermissao];
                                console.log(modulo, permissao);
                                if (rsPermissoes.findIndex(function (rs) { return rs.modulo === modulo && rs.permissao === permissao; }) < 0) {
                                    retorno[keyModulo].PERMISSOES[keyPermissao] = '';
                                }
                            });
                        });
                        console.log('permissoes encontradas pela pesquisa', rsPermissoes);
                        console.log('retorno obtido do teste', retorno);
                        return [2 /*return*/, retorno];
                }
            });
        });
    };
    return ClsLoginUsuarioController;
}());
exports.default = ClsLoginUsuarioController;
//# sourceMappingURL=loginUsuario.controller.cls.js.map