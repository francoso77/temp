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
exports.RedefinirSenhaController = void 0;
var common_1 = require("@nestjs/common");
var uuid_1 = require("uuid");
var usuario_service_1 = require("../auth/services/usuario.service");
var email_service_1 = require("../auth/services/email.service");
var RedefinirSenhaController = /** @class */ (function () {
    function RedefinirSenhaController(usuarioService, emailService) {
        this.usuarioService = usuarioService;
        this.emailService = emailService;
    }
    RedefinirSenhaController.prototype.forgotPassword = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var usuario, token, resetTokenExpires, resetLink;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.usuarioService.findByEmail(email)];
                    case 1:
                        usuario = _a.sent();
                        if (!usuario) {
                            throw new common_1.BadRequestException('Usuário não encontrado');
                        }
                        token = (0, uuid_1.v4)();
                        resetTokenExpires = new Date();
                        resetTokenExpires.setHours(resetTokenExpires.getHours() + 1); // 1 hora de validade
                        // Atualizar o token no banco de dados
                        return [4 /*yield*/, this.usuarioService.updateUser(usuario.idUsuario, { resetToken: token, resetTokenExpires: resetTokenExpires })];
                    case 2:
                        // Atualizar o token no banco de dados
                        _a.sent();
                        resetLink = "http://localhost:3000/reset-password?token=".concat(token);
                        // Enviar e-mail com o link
                        return [4 /*yield*/, this.emailService.sendPasswordResetEmail(usuario.email, resetLink)];
                    case 3:
                        // Enviar e-mail com o link
                        _a.sent();
                        return [2 /*return*/, { message: 'E-mail enviado com sucesso!' }];
                }
            });
        });
    };
    RedefinirSenhaController.prototype.resetPassword = function (token, newPassword) {
        return __awaiter(this, void 0, void 0, function () {
            var usuario;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.usuarioService.findByResetToken(token)];
                    case 1:
                        usuario = _a.sent();
                        if (!usuario || new Date() > usuario.resetTokenExpires) {
                            throw new common_1.BadRequestException('Token inválido ou expirado');
                        }
                        // Atualizar senha e limpar token
                        return [4 /*yield*/, this.usuarioService.updateUser(usuario.idUsuario, {
                                senha: newPassword, // Certifique-se de hashear a senha
                                resetToken: null,
                                resetTokenExpires: null,
                            })];
                    case 2:
                        // Atualizar senha e limpar token
                        _a.sent();
                        return [2 /*return*/, { message: 'Senha redefinida com sucesso!' }];
                }
            });
        });
    };
    __decorate([
        (0, common_1.Post)('forgotPassword'),
        __param(0, (0, common_1.Body)('email')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], RedefinirSenhaController.prototype, "forgotPassword", null);
    __decorate([
        (0, common_1.Post)('resetPassword'),
        __param(0, (0, common_1.Body)('token')),
        __param(1, (0, common_1.Body)('newPassword')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String]),
        __metadata("design:returntype", Promise)
    ], RedefinirSenhaController.prototype, "resetPassword", null);
    RedefinirSenhaController = __decorate([
        (0, common_1.Controller)('redefinirSenha'),
        __metadata("design:paramtypes", [usuario_service_1.UsuarioService,
            email_service_1.EmailService])
    ], RedefinirSenhaController);
    return RedefinirSenhaController;
}());
exports.RedefinirSenhaController = RedefinirSenhaController;
//# sourceMappingURL=redefinirSenha.controller.js.map