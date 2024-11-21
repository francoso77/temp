"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var crud_controller_1 = require("./controllers/crud.controller");
var out_controller_1 = require("./controllers/out.controller");
var roles_guard_1 = require("./auth/roles.guard");
var app_service_1 = require("./app.service");
var core_1 = require("@nestjs/core");
var global_module_1 = require("./global.module");
var app_controller_1 = require("./app.controller");
var loginUsuario_controller_1 = require("./controllers/loginUsuario.controller");
var autenticacao_middleware_1 = require("./auth/autenticacao.middleware");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule.prototype.configure = function (consumer) {
        consumer
            .apply(autenticacao_middleware_1.AutenticacaoMiddleware)
            .forRoutes('*');
    };
    AppModule = __decorate([
        (0, common_1.Module)({
            imports: [global_module_1.GlobalModule],
            controllers: [crud_controller_1.CrudController, out_controller_1.OutController, app_controller_1.AppController, loginUsuario_controller_1.LoginUsuarioController],
            providers: [app_service_1.AppService, {
                    provide: core_1.APP_GUARD,
                    useClass: roles_guard_1.RolesGuard,
                }],
            exports: []
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map