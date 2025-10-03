"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalModule = void 0;
var common_1 = require("@nestjs/common");
var contexto_service_1 = require("./auth/services/contexto.service");
var sessao_service_1 = require("./auth/services/sessao.service");
var GlobalModule = /** @class */ (function () {
    function GlobalModule() {
    }
    GlobalModule = __decorate([
        (0, common_1.Global)(),
        (0, common_1.Module)({
            imports: [],
            controllers: [],
            providers: [contexto_service_1.ContextoService, sessao_service_1.SessaoService,],
            exports: [contexto_service_1.ContextoService, sessao_service_1.SessaoService],
        })
    ], GlobalModule);
    return GlobalModule;
}());
exports.GlobalModule = GlobalModule;
//# sourceMappingURL=global.module.js.map