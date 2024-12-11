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
exports.RolesGuard = void 0;
var common_1 = require("@nestjs/common");
var core_1 = require("@nestjs/core");
var roles_decorator_1 = require("./roles.decorator");
var sessao_service_1 = require("./services/sessao.service");
//scope do Roles tem que ser igual ao do sessão
var RolesGuard = /** @class */ (function () {
    function RolesGuard(reflector, 
    // private readonly contextoGlobal: ContextoService,
    sessao) {
        this.reflector = reflector;
        this.sessao = sessao;
        console.log('Constructor do Roles Guard....');
    }
    //tranformar o canactivate em Promise
    RolesGuard.prototype.canActivate = function (context) {
        var requiredRoles = this.reflector.getAllAndOverride(roles_decorator_1.ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            // return Promise.resolve(true)
            return true;
        }
        var request = context.switchToHttp().getRequest();
        // const clsAcesso = new ClsAcesso()
        // return clsAcesso.checarAcesso(
        //   this.sessao.usuarioSessao,
        //   requiredRoles.modulo,
        //   requiredRoles.permissao).then(checarAcesso => {
        //     return checarAcesso
        //   })
        console.log("[RolesGuard] - Request Headers: ", request.headers.authorization);
        return true;
    };
    RolesGuard = __decorate([
        (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
        __metadata("design:paramtypes", [core_1.Reflector,
            sessao_service_1.SessaoService])
    ], RolesGuard);
    return RolesGuard;
}());
exports.RolesGuard = RolesGuard;
//# sourceMappingURL=roles.guard%20copy.js.map