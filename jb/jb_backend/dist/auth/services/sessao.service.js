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
exports.SessaoService = void 0;
var common_1 = require("@nestjs/common");
//scope da sessão tem que ser igual ao do RolesGuard
var SessaoService = /** @class */ (function () {
    function SessaoService() {
        this.usuarioSessao = 0;
        console.log('Constructor do Sessao Service....');
    }
    SessaoService = __decorate([
        (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
        __metadata("design:paramtypes", [])
    ], SessaoService);
    return SessaoService;
}());
exports.SessaoService = SessaoService;
//# sourceMappingURL=sessao.service.js.map