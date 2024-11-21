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
var PERMISSOES = [
    { modulo: 'clientes', permissao: 'incluir' },
    { modulo: 'login', permissao: 'logar' },
    { modulo: 'pedidos', permissao: 'consultar' },
    { modulo: 'entradas', permissao: 'deletar' },
    { modulo: 'estoques', permissao: 'consultar' },
    { modulo: 'crud', permissao: 'pesquisar' },
];
var RolesGuard = /** @class */ (function () {
    function RolesGuard(reflector) {
        this.reflector = reflector;
        console.log('Constructor do Roles Guard....');
    }
    RolesGuard.prototype.canActivate = function (context) {
        var requiredRoles = this.reflector.getAllAndOverride(roles_decorator_1.ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        //const { nomeUsuario, tempo } = context.switchToHttp().getRequest().body;
        // const { cpf, senha } = context.switchToHttp().getRequest().body;
        // console.log("[RolesGuard] - nomeUsuario: ", nomeUsuario)
        // console.log("[RolesGuard] - tempo: ", tempo)
        // console.log("[RolesGuard] - ContextoGlobal: ", this.contextoGlobal.usuarioContexto)
        // console.log("[RolesGuard] - ContextoSessao: ", this.sessao.usuarioSessao)
        // console.log("[RolesGuard] - cpf: ", cpf)
        // console.log("[RolesGuard] - senha: ", senha)
        // console.log("[RolesGuard] - requiredRoles: ", requiredRoles)
        // if (!requiredRoles) {
        //   return false;
        // } else {
        //   let permissao = PERMISSOES.find((permissao) => permissao.modulo === requiredRoles.modulo && permissao.permissao === requiredRoles.permissao)
        //   if (!permissao) {
        //     throw new HttpException('Acesso negado', HttpStatus.FORBIDDEN);
        //   }
        // }
        // return true
        // const { user } = context.switchToHttp().getRequest();
        // return requiredRoles.some((role) => user.roles?.includes(role));
        if (!requiredRoles) {
            return true;
        }
        var request = context.switchToHttp().getRequest();
        console.log("[RolesGuard] - Request Headers: ", request.headers.authorization);
        return true;
    };
    RolesGuard = __decorate([
        (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
        __metadata("design:paramtypes", [core_1.Reflector])
    ], RolesGuard);
    return RolesGuard;
}());
exports.RolesGuard = RolesGuard;
//# sourceMappingURL=roles.guard.js.map