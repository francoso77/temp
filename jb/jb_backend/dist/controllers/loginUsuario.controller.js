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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUsuarioController = void 0;
var common_1 = require("@nestjs/common");
var loginUsuario_controller_cls_1 = require("../services/loginUsuario.controller.cls");
var sessao_service_1 = require("../auth/services/sessao.service");
var LoginUsuarioController = /** @class */ (function () {
    function LoginUsuarioController(
    // Atribuindo a sessão com o usuário logado,
    sessao) {
        this.sessao = sessao;
        //console.log('Controller de Login e Permissões do Usuário....')
    }
    //verifica o cpf e senha no login
    LoginUsuarioController.prototype.loginUsuario = function (cpf, senha) {
        return new loginUsuario_controller_cls_1.default().logar(cpf, senha);
    };
    // //verfica quais as permissoes do usuario logado
    LoginUsuarioController.prototype.updatePermissoesUsuario = function () {
        if (this.sessao.usuarioSessao) {
            return new loginUsuario_controller_cls_1.default().updatePermissoesUsuario(this.sessao.usuarioSessao);
        }
        else {
            return Promise.reject(null);
        }
    };
    LoginUsuarioController.prototype.logoutUsuario = function (email) {
        return new loginUsuario_controller_cls_1.default().logout(email);
    };
    __decorate([
        (0, common_1.Post)('loginUsuario'),
        __param(0, (0, common_1.Body)('cpf')),
        __param(1, (0, common_1.Body)('senha')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String]),
        __metadata("design:returntype", Promise)
    ], LoginUsuarioController.prototype, "loginUsuario", null);
    __decorate([
        (0, common_1.Post)('updatePermissoesUsuario'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], LoginUsuarioController.prototype, "updatePermissoesUsuario", null);
    __decorate([
        (0, common_1.Post)('logoutUsuario'),
        __param(0, (0, common_1.Body)('email')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], LoginUsuarioController.prototype, "logoutUsuario", null);
    LoginUsuarioController = __decorate([
        (0, common_1.Controller)(),
        __metadata("design:paramtypes", [sessao_service_1.SessaoService])
    ], LoginUsuarioController);
    return LoginUsuarioController;
}());
exports.LoginUsuarioController = LoginUsuarioController;
//# sourceMappingURL=loginUsuario.controller.js.map