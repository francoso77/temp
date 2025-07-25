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
var pessoa_entity_1 = require("./pessoa.entity");
var produto_entity_1 = require("./produto.entity");
var cor_entity_1 = require("./cor.entity");
var Estoque = /** @class */ (function () {
    function Estoque() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], Estoque.prototype, "idEstoque", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], Estoque.prototype, "idProduto", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idProduto' }),
        (0, typeorm_1.ManyToOne)(function () { return produto_entity_1.default; }),
        __metadata("design:type", produto_entity_1.default)
    ], Estoque.prototype, "produto", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], Estoque.prototype, "idPessoa_fornecedor", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idPessoa_fornecedor' }),
        (0, typeorm_1.ManyToOne)(function () { return pessoa_entity_1.default; }),
        __metadata("design:type", pessoa_entity_1.default)
    ], Estoque.prototype, "fornecedor", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'float', precision: 4 }),
        __metadata("design:type", Number)
    ], Estoque.prototype, "qtd", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true }),
        __metadata("design:type", Number)
    ], Estoque.prototype, "idCor", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idCor' }),
        (0, typeorm_1.ManyToOne)(function () { return cor_entity_1.default; }),
        __metadata("design:type", cor_entity_1.default)
    ], Estoque.prototype, "cor", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ name: 'createdAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], Estoque.prototype, "createAt", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], Estoque.prototype, "updateAt", void 0);
    Estoque = __decorate([
        (0, typeorm_1.Entity)({ name: 'estoques' }),
        (0, typeorm_1.Index)('IDX_ESTOQUE_PRODUTO', ['idProduto']),
        (0, typeorm_1.Index)('IDX_ESTOQUE_FORNECEDOR', ['idPessoa_fornecedor']),
        (0, typeorm_1.Index)('IDX_ESTOQUE_COR', ['idCor']),
        (0, typeorm_1.Index)('IDX_ESTOQUE_UNICO', ['idProduto', 'idCor', 'idPessoa_fornecedor'], { unique: true }) // opcional, se 1 estoque por combinação
    ], Estoque);
    return Estoque;
}());
exports.default = Estoque;
//# sourceMappingURL=estoque.entity.js.map