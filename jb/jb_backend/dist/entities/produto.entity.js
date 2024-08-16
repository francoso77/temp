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
var detalheEntrada_entity_1 = require("./detalheEntrada.entity");
var unidadeMedida_entity_1 = require("./unidadeMedida.entity");
var producaoMalharia_entity_1 = require("./producaoMalharia.entity");
var detalheProducaoDublagem_entity_1 = require("./detalheProducaoDublagem.entity");
var estoque_entity_1 = require("./estoque.entity");
var detalheProgramacao_entity_1 = require("./detalheProgramacao.entity");
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
        (0, typeorm_1.JoinColumn)({ name: "idProduto" }),
        (0, typeorm_1.OneToMany)(function () { return detalheProducaoDublagem_entity_1.default; }, function (detalheProducaoDublagem) {
            return detalheProducaoDublagem.produto;
        }, { cascade: true }),
        __metadata("design:type", Array)
    ], Produto.prototype, "producaoDublagens", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: "idProduto" }),
        (0, typeorm_1.OneToMany)(function () { return detalheEntrada_entity_1.default; }, function (entrada) {
            return entrada.produto;
        }, { cascade: true }),
        __metadata("design:type", Array)
    ], Produto.prototype, "entradas", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: "idProduto" }),
        (0, typeorm_1.OneToMany)(function () { return producaoMalharia_entity_1.default; }, function (producaoMalharia) {
            return producaoMalharia.produto;
        }, { cascade: true }),
        __metadata("design:type", Array)
    ], Produto.prototype, "producaoMalharias", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: "idProduto" }),
        (0, typeorm_1.OneToMany)(function () { return estoque_entity_1.default; }, function (estoque) {
            return estoque.produto;
        }, { cascade: true }),
        __metadata("design:type", Array)
    ], Produto.prototype, "estoques", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: "idProduto" }),
        (0, typeorm_1.OneToMany)(function () { return detalheProgramacao_entity_1.default; }, function (detalheProgramacao) {
            return detalheProgramacao.produto;
        }, { cascade: true }),
        __metadata("design:type", Array)
    ], Produto.prototype, "detalheProgramacoes", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ name: 'createdAt', type: 'timestamp' }),
        __metadata("design:type", Date)
    ], Produto.prototype, "createAD", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt', type: 'timestamp' }),
        __metadata("design:type", Date)
    ], Produto.prototype, "updateAD", void 0);
    Produto = __decorate([
        (0, typeorm_1.Entity)({ name: 'produtos' })
    ], Produto);
    return Produto;
}());
exports.default = Produto;
//# sourceMappingURL=produto.entity.js.map