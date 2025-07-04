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
var data_source_1 = require("../data-source");
var uuid_1 = require("uuid");
var typeorm_1 = require("typeorm");
var user_1 = require("../entity/sistema/user");
var userSection_1 = require("../entity/sistema/userSection");
var bcrypt = require("bcrypt");
// interface rsSqlPermissaoPorUsuario {
//   modulo: string
//   permissao: string
// }
// const SQL_PERMISSAO_POR_USUARIO = `
//     SELECT m.modulo, mp.permissao FROM modulospermissoes AS mp 
//     INNER JOIN modulos AS m
//     ON mp.idModulo = m.idModulo
//     INNER JOIN 
//     (
//     SELECT grpe.idModuloPermissao FROM gruposusuarios AS grus
//     INNER JOIN grupospermissoes AS grpe
//     ON grus.idGrupo = grpe.idGrupo
//     WHERE grus.idUsuario = ?
//     UNION ALL
//     SELECT uspe.idModuloPermissao FROM usuariospermissoes AS uspe
//     WHERE uspe.idUsuario = ?
//     ) AS permissoes
//     ON mp.idModuloPermissao = permissoes.idModuloPermissao
// `
var ClsLoginUsuarioController = /** @class */ (function () {
    function ClsLoginUsuarioController() {
    }
    ClsLoginUsuarioController.prototype.logout = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fecharSessoesEmAberto(email).then(function (rsUsuarioExistente) {
                        if (rsUsuarioExistente) {
                            return data_source_1.AppDataSource.getRepository(user_1.User).update({ email: email }, { isActive: false }).then(function () {
                                return {
                                    ok: true,
                                    mensagem: 'Usuário deslogado com sucesso.',
                                    dados: {
                                        idUsuario: '',
                                        nomeUsuario: '',
                                        token: '',
                                        emailUsuario: '',
                                        fotoUsuario: ''
                                    }
                                };
                            });
                        }
                    })];
            });
        });
    };
    ClsLoginUsuarioController.prototype.logar = function (email, senha) {
        return __awaiter(this, void 0, void 0, function () {
            var retorno, usuarioAtivo, usuario, senhaValida, token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        retorno = {
                            ok: false,
                            mensagem: 'Usuário ou senha inválidos.',
                            dados: {
                                idUsuario: '',
                                nomeUsuario: '',
                                token: '',
                                emailUsuario: '',
                                fotoUsuario: ''
                            }
                        };
                        return [4 /*yield*/, this.fecharSessoesEmAberto(email)];
                    case 1:
                        usuarioAtivo = _a.sent();
                        if (!usuarioAtivo) {
                            return [2 /*return*/, retorno];
                        }
                        return [4 /*yield*/, data_source_1.AppDataSource.getRepository(user_1.User).findOne({
                                where: { email: email, tentativasLogin: (0, typeorm_1.LessThan)(4) }
                            })];
                    case 2:
                        usuario = _a.sent();
                        if (!usuario) {
                            return [2 /*return*/, retorno];
                        }
                        return [4 /*yield*/, bcrypt.compare(senha, usuario.password)];
                    case 3:
                        senhaValida = _a.sent();
                        if (!!senhaValida) return [3 /*break*/, 5];
                        // Incrementa tentativas de login
                        return [4 /*yield*/, data_source_1.AppDataSource.getRepository(user_1.User).update({ email: email }, { tentativasLogin: function () { return "tentativasLogin + 1"; } })];
                    case 4:
                        // Incrementa tentativas de login
                        _a.sent();
                        return [2 /*return*/, retorno];
                    case 5:
                        token = (0, uuid_1.v4)();
                        return [4 /*yield*/, data_source_1.AppDataSource.getRepository(user_1.User).update({ id: usuario.id }, { tentativasLogin: 0 })];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, data_source_1.AppDataSource.getRepository(userSection_1.UserSection).save({
                                userId: usuario.id,
                                isActive: true,
                                token: token,
                            })];
                    case 7:
                        _a.sent();
                        return [2 /*return*/, {
                                ok: true,
                                mensagem: 'Login efetuado com sucesso.',
                                dados: {
                                    idUsuario: usuario.id,
                                    nomeUsuario: usuario.name,
                                    token: token,
                                    emailUsuario: usuario.email,
                                    fotoUsuario: usuario.profilePicture
                                }
                            }];
                }
            });
        });
    };
    ClsLoginUsuarioController.prototype.fecharSessoesEmAberto = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var rsUsuarioExistente;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, data_source_1.AppDataSource.getRepository(user_1.User).findOne({ where: { email: email } })];
                    case 1:
                        rsUsuarioExistente = _a.sent();
                        if (rsUsuarioExistente) {
                            return [2 /*return*/, data_source_1.AppDataSource.getRepository(userSection_1.UserSection).update({ id: rsUsuarioExistente.id }, { isActive: false }).then(function () {
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
    return ClsLoginUsuarioController;
}());
exports.default = ClsLoginUsuarioController;
//# sourceMappingURL=loginUsuario.controller.cls.js.map