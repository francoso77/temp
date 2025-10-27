"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProdutoModule = void 0;
var common_1 = require("@nestjs/common");
var produto_service_1 = require("./auth/services/produto.service");
var produto_1 = require("./entity/produto");
var typeorm_1 = require("@nestjs/typeorm");
var produto_controller_1 = require("./controllers/produto.controller");
var ProdutoModule = /** @class */ (function () {
    function ProdutoModule() {
    }
    ProdutoModule = __decorate([
        (0, common_1.Module)({
            imports: [typeorm_1.TypeOrmModule.forFeature([produto_1.default])],
            providers: [produto_service_1.ProdutoService],
            controllers: [produto_controller_1.ProdutoController],
            exports: [produto_service_1.ProdutoService],
        })
    ], ProdutoModule);
    return ProdutoModule;
}());
exports.ProdutoModule = ProdutoModule;
//# sourceMappingURL=produto.module.js.map