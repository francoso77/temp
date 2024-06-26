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
var produto_entity_1 = require("./produto.entity");
var detalheEstrutura_entity_1 = require("./detalheEstrutura.entity");
var Estrutura = /** @class */ (function () {
    function Estrutura() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], Estrutura.prototype, "idEstrutura", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 2 }),
        __metadata("design:type", String)
    ], Estrutura.prototype, "unidade", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'float', precision: 2 }),
        __metadata("design:type", Number)
    ], Estrutura.prototype, "qtdBase", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], Estrutura.prototype, "idProduto", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idProduto' }),
        (0, typeorm_1.ManyToOne)(function () { return produto_entity_1.default; }, function (produto) { return produto.estruturas; }),
        __metadata("design:type", produto_entity_1.default)
    ], Estrutura.prototype, "produto", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return detalheEstrutura_entity_1.default; }, function (detalheEstrutura) { return detalheEstrutura.estrutura; }),
        __metadata("design:type", Array)
    ], Estrutura.prototype, "detalheEstruturas", void 0);
    Estrutura = __decorate([
        (0, typeorm_1.Entity)({ name: 'estruturas' })
    ], Estrutura);
    return Estrutura;
}());
exports.default = Estrutura;
//# sourceMappingURL=estrutura.entity.js.map