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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerMiddleware = void 0;
var common_1 = require("@nestjs/common");
var sessao_service_1 = require("./services/sessao.service");
var contexto_service_1 = require("./services/contexto.service");
var LoggerMiddleware = /** @class */ (function () {
    function LoggerMiddleware(contexto, sessao) {
        this.contexto = contexto;
        this.sessao = sessao;
        console.log('Constructor do Logger Middleware....');
    }
    LoggerMiddleware.prototype.use = function (req, res, next) {
        console.log("[logger.middleware] - usuarioContexto ", this.contexto.usuarioContexto);
        console.log("[logger.middleware] - usuarioSessao ", this.sessao.usuarioSessao);
        this.contexto.usuarioContexto = req.body.nomeUsuario || "Usuário/cpf [contexto] Alterado dentro do Middleware";
        this.sessao.usuarioSessao = req.body.nomeUsuario || "Usuário/cpf [sessao] Alterado dentro do Middleware";
        if (req.body.tempo) {
            setTimeout(function () {
                next();
            }, req.body.tempo);
        }
        else {
            next();
        }
    };
    LoggerMiddleware = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [contexto_service_1.ContextoService,
            sessao_service_1.SessaoService])
    ], LoggerMiddleware);
    return LoggerMiddleware;
}());
exports.LoggerMiddleware = LoggerMiddleware;
//# sourceMappingURL=logger.middleware.js.map