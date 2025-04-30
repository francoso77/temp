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
exports.AppController = void 0;
var common_1 = require("@nestjs/common");
var app_service_1 = require("./app.service");
var roles_decorator_1 = require("./auth/roles.decorator");
var contexto_service_1 = require("./auth/services/contexto.service");
var sessao_service_1 = require("./auth/services/sessao.service");
var AppController = /** @class */ (function () {
    function AppController(appService, contexto, sessao) {
        this.appService = appService;
        this.contexto = contexto;
        this.sessao = sessao;
        console.log('Construtor do AppController....');
    }
    AppController.prototype.getHello = function () {
        return this.sessao.usuarioSessao + ' ' + this.appService.getHello();
    };
    __decorate([
        (0, roles_decorator_1.Roles)({ modulo: 'AppController', permissao: 'getHello' }),
        (0, common_1.Post)('Hello'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", String)
    ], AppController.prototype, "getHello", null);
    AppController = __decorate([
        (0, common_1.Controller)(),
        __metadata("design:paramtypes", [app_service_1.AppService,
            contexto_service_1.ContextoService,
            sessao_service_1.SessaoService])
    ], AppController);
    return AppController;
}());
exports.AppController = AppController;
//# sourceMappingURL=app.controller.js.map