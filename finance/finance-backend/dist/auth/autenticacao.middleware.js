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
exports.AutenticacaoMiddleware = void 0;
var common_1 = require("@nestjs/common");
var sessao_service_1 = require("./services/sessao.service");
var autenticacao_middleware_cls_1 = require("../services/autenticacao.middleware.cls");
var AutenticacaoMiddleware = /** @class */ (function () {
    function AutenticacaoMiddleware(sessao) {
        this.sessao = sessao;
    }
    AutenticacaoMiddleware.prototype.use = function (req, res, next) {
        var _this = this;
        var clsAutenticacaoMiddleware = new autenticacao_middleware_cls_1.default();
        console.log("[AutenticacaoMiddleware] - req.headers.authorization: ", req.headers.authorization);
        clsAutenticacaoMiddleware.pesquisarToken(req.headers.authorization).then(function (idUsuario) {
            console.log("[AutenticacaoMiddleware] - idUsuario: ", idUsuario);
            _this.sessao.usuarioSessao = idUsuario.toString();
            next();
            // if (idUsuario) {
            //   this.sessao.usuarioSessao = idUsuario
            //   next()
            // } else {
            //   res.status(401).send({ ok: false, mensagem: 'Token invalido', dados: null })
            //   next()
            // }
        });
    };
    AutenticacaoMiddleware = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [sessao_service_1.SessaoService])
    ], AutenticacaoMiddleware);
    return AutenticacaoMiddleware;
}());
exports.AutenticacaoMiddleware = AutenticacaoMiddleware;
//# sourceMappingURL=autenticacao.middleware.js.map