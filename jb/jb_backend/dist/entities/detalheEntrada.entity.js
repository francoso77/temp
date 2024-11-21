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
var tinturaria_entity_1 = require("./tinturaria.entity");
var DetalheEntrada = /** @class */ (function () {
    function DetalheEntrada() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], DetalheEntrada.prototype, "idDetalheEntrada", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], DetalheEntrada.prototype, "idEntrada", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idEntrada' }),
        (0, typeorm_1.ManyToOne)(function () { return entrada_entity_1.default; }, function (entrada) { return entrada.detalheEntradas; }, {
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            orphanedRowAction: 'delete'
        }),
        __metadata("design:type", entrada_entity_1.default)
    ], DetalheEntrada.prototype, "entrada", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], DetalheEntrada.prototype, "idProduto", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idProduto' }),
        (0, typeorm_1.ManyToOne)(function () { return produto_entity_1.default; }),
        __metadata("design:type", produto_entity_1.default)
    ], DetalheEntrada.prototype, "produto", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true }),
        __metadata("design:type", Number)
    ], DetalheEntrada.prototype, "idCor", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idCor' }),
        (0, typeorm_1.ManyToOne)(function () { return cor_entity_1.default; }),
        __metadata("design:type", cor_entity_1.default)
    ], DetalheEntrada.prototype, "cor", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'float', precision: 4, nullable: true }),
        __metadata("design:type", Number)
    ], DetalheEntrada.prototype, "qtdPecas", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'float', precision: 4 }),
        __metadata("design:type", Number)
    ], DetalheEntrada.prototype, "vrUnitario", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'float', precision: 4 }),
        __metadata("design:type", Number)
    ], DetalheEntrada.prototype, "qtd", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'float', precision: 4, nullable: true }),
        __metadata("design:type", Number)
    ], DetalheEntrada.prototype, "metro", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'float', precision: 4, nullable: true }),
        __metadata("design:type", Number)
    ], DetalheEntrada.prototype, "gm2", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true }),
        __metadata("design:type", Number)
    ], DetalheEntrada.prototype, "idPessoa_revisador", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idPessoa_revisador' }),
        (0, typeorm_1.ManyToOne)(function () { return pessoa_entity_1.default; }),
        __metadata("design:type", pessoa_entity_1.default)
    ], DetalheEntrada.prototype, "revisador", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true }),
        __metadata("design:type", Number)
    ], DetalheEntrada.prototype, "idTinturaria", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idTinturaria' }),
        (0, typeorm_1.ManyToOne)(function () { return tinturaria_entity_1.default; }),
        __metadata("design:type", tinturaria_entity_1.default)
    ], DetalheEntrada.prototype, "romaneio", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'float', precision: 4, nullable: true }),
        __metadata("design:type", Number)
    ], DetalheEntrada.prototype, "perdaMalharia", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'float', precision: 4, nullable: true }),
        __metadata("design:type", Number)
    ], DetalheEntrada.prototype, "perdaTinturaria", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ name: 'createdAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], DetalheEntrada.prototype, "createAt", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], DetalheEntrada.prototype, "updateAt", void 0);
    DetalheEntrada = __decorate([
        (0, typeorm_1.Entity)({ name: 'detalheentradas' })
    ], DetalheEntrada);
    return DetalheEntrada;
}());
exports.default = DetalheEntrada;
//# sourceMappingURL=detalheEntrada.entity.js.map