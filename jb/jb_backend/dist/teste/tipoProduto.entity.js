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
var typeorm_1 = require("typeorm");
var produto_entity_1 = require("../entities/produto.entity");
var TipoProduto = /** @class */ (function () {
    function TipoProduto() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], TipoProduto.prototype, "idTipoProduto", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 35 }),
        __metadata("design:type", String)
    ], TipoProduto.prototype, "nome", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Boolean)
    ], TipoProduto.prototype, "estrutura", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return produto_entity_1.default; }, function (produto) { return produto.tipoProduto; }),
        __metadata("design:type", Array)
    ], TipoProduto.prototype, "produtos", void 0);
    TipoProduto = __decorate([
        (0, typeorm_1.Entity)({ name: 'tipoprodutos' })
    ], TipoProduto);
    return TipoProduto;
}());
exports.default = TipoProduto;
//# sourceMappingURL=tipoProduto.entity.js.map