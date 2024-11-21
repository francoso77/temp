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
var estrutura_entity_1 = require("./estrutura.entity");
var produto_entity_1 = require("./produto.entity");
var cor_entity_1 = require("./cor.entity");
var DetalheEstrutura = /** @class */ (function () {
    function DetalheEstrutura() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], DetalheEstrutura.prototype, "idDetalheEstrutura", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], DetalheEstrutura.prototype, "idEstrutura", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idEstrutura' }),
        (0, typeorm_1.ManyToOne)(function () { return estrutura_entity_1.default; }, function (estrutura) { return estrutura.detalheEstruturas; }, {
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            orphanedRowAction: 'delete'
        }),
        __metadata("design:type", estrutura_entity_1.default)
    ], DetalheEstrutura.prototype, "estrutura", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], DetalheEstrutura.prototype, "idProduto", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idProduto' }),
        (0, typeorm_1.ManyToOne)(function () { return produto_entity_1.default; }),
        __metadata("design:type", produto_entity_1.default)
    ], DetalheEstrutura.prototype, "produto", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true }),
        __metadata("design:type", Number)
    ], DetalheEstrutura.prototype, "idCor", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idCor' }),
        (0, typeorm_1.ManyToOne)(function () { return cor_entity_1.default; }),
        __metadata("design:type", cor_entity_1.default)
    ], DetalheEstrutura.prototype, "cor", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'float', precision: 4 }),
        __metadata("design:type", Number)
    ], DetalheEstrutura.prototype, "qtd", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ name: 'createdAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], DetalheEstrutura.prototype, "createAt", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], DetalheEstrutura.prototype, "updateAt", void 0);
    DetalheEstrutura = __decorate([
        (0, typeorm_1.Entity)({ name: 'detalheestruturas' })
    ], DetalheEstrutura);
    return DetalheEstrutura;
}());
exports.default = DetalheEstrutura;
//# sourceMappingURL=detalheEstrutura.entity.js.map