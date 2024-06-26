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
var entrada_entity_1 = require("./entrada.entity");
var cor_entity_1 = require("./cor.entity");
var pessoa_entity_1 = require("./pessoa.entity");
var DetalheEntrada = /** @class */ (function () {
    function DetalheEntrada() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], DetalheEntrada.prototype, "idDetalheEntrada", void 0);
    __decorate([
        (0, typeorm_1.PrimaryColumn)(),
        __metadata("design:type", Number)
    ], DetalheEntrada.prototype, "idEntrada", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return entrada_entity_1.default; }, function (entrada) { return entrada.detalheEntradas; }),
        __metadata("design:type", entrada_entity_1.default)
    ], DetalheEntrada.prototype, "entrada", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], DetalheEntrada.prototype, "idProduto", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idProduto' }),
        (0, typeorm_1.ManyToOne)(function () { return produto_entity_1.default; }, function (produto) { return produto.entradas; }),
        __metadata("design:type", produto_entity_1.default)
    ], DetalheEntrada.prototype, "produto", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], DetalheEntrada.prototype, "idCor", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idCor' }),
        (0, typeorm_1.ManyToOne)(function () { return cor_entity_1.default; }, function (cor) { return cor.corDetalheEntradas; }),
        __metadata("design:type", cor_entity_1.default)
    ], DetalheEntrada.prototype, "cor", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'float', precision: 2 }),
        __metadata("design:type", Number)
    ], DetalheEntrada.prototype, "qtdPecas", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'float', precision: 2 }),
        __metadata("design:type", Number)
    ], DetalheEntrada.prototype, "vrUnitario", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'float', precision: 2 }),
        __metadata("design:type", Number)
    ], DetalheEntrada.prototype, "peso", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'float', precision: 2 }),
        __metadata("design:type", Number)
    ], DetalheEntrada.prototype, "metro", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'float', precision: 2 }),
        __metadata("design:type", Number)
    ], DetalheEntrada.prototype, "gm2", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], DetalheEntrada.prototype, "idPessoa_revisador", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idPessoaRevisador' }),
        (0, typeorm_1.ManyToOne)(function () { return pessoa_entity_1.default; }, function (pessoa) { return pessoa.revisadorDetalheEntradas; }),
        __metadata("design:type", pessoa_entity_1.default)
    ], DetalheEntrada.prototype, "revisador", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 10 }),
        __metadata("design:type", String)
    ], DetalheEntrada.prototype, "romaneio", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'float', precision: 2 }),
        __metadata("design:type", Number)
    ], DetalheEntrada.prototype, "malharia", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'float', precision: 2 }),
        __metadata("design:type", Number)
    ], DetalheEntrada.prototype, "tinturaria", void 0);
    DetalheEntrada = __decorate([
        (0, typeorm_1.Entity)({ name: 'detalheentradas' })
    ], DetalheEntrada);
    return DetalheEntrada;
}());
exports.default = DetalheEntrada;
//# sourceMappingURL=detalheEntrada.entity.js.map