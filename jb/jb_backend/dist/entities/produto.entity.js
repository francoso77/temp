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
var unidadeMedida_entity_1 = require("./unidadeMedida.entity");
var tipoProdutoypes_1 = require("../types/tipoProdutoypes");
var Produto = /** @class */ (function () {
    function Produto() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], Produto.prototype, "idProduto", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 80 }),
        (0, typeorm_1.Index)({ unique: true }),
        __metadata("design:type", String)
    ], Produto.prototype, "nome", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], Produto.prototype, "idUnidade", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idUnidade' }),
        (0, typeorm_1.ManyToOne)(function () { return unidadeMedida_entity_1.default; }),
        __metadata("design:type", unidadeMedida_entity_1.default)
    ], Produto.prototype, "unidadeMedida", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true, length: 10 }),
        __metadata("design:type", String)
    ], Produto.prototype, "localizacao", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true, type: 'float', precision: 4 }),
        __metadata("design:type", Number)
    ], Produto.prototype, "largura", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true, type: 'float', precision: 4 }),
        __metadata("design:type", Number)
    ], Produto.prototype, "gm2", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: false }),
        __metadata("design:type", Boolean)
    ], Produto.prototype, "ativo", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], Produto.prototype, "tipoProduto", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ name: 'createdAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], Produto.prototype, "createAt", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], Produto.prototype, "updateAt", void 0);
    Produto = __decorate([
        (0, typeorm_1.Entity)({ name: 'produtos' })
    ], Produto);
    return Produto;
}());
exports.default = Produto;
//# sourceMappingURL=produto.entity.js.map