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
var producaoDublagem_entity_1 = require("./producaoDublagem.entity");
var produto_entity_1 = require("./produto.entity");
var detalhePeca_entity_1 = require("./detalhePeca.entity");
var DetalheProducaoDublagem = /** @class */ (function () {
    function DetalheProducaoDublagem() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], DetalheProducaoDublagem.prototype, "idDetalheProducaoDublagem", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], DetalheProducaoDublagem.prototype, "idDublagem", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'float', precision: 4 }),
        __metadata("design:type", Number)
    ], DetalheProducaoDublagem.prototype, "metrosTotal", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'int', precision: 0 }),
        __metadata("design:type", Number)
    ], DetalheProducaoDublagem.prototype, "pecasTotal", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], DetalheProducaoDublagem.prototype, "idProduto", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idProduto' }),
        (0, typeorm_1.ManyToOne)(function () { return produto_entity_1.default; }),
        __metadata("design:type", produto_entity_1.default)
    ], DetalheProducaoDublagem.prototype, "produto", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idDublagem' }),
        (0, typeorm_1.ManyToOne)(function () { return producaoDublagem_entity_1.default; }, function (producaoDublagem) { return producaoDublagem.detalheProducaoDublagens; }, {
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            orphanedRowAction: 'delete'
        }),
        __metadata("design:type", producaoDublagem_entity_1.default)
    ], DetalheProducaoDublagem.prototype, "producaoDublagem", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idDetalheProducaoDublagem' }),
        (0, typeorm_1.OneToMany)(function () { return detalhePeca_entity_1.default; }, function (detalhePeca) { return detalhePeca.detalheProducaoDublagem; }, { cascade: true }),
        __metadata("design:type", Array)
    ], DetalheProducaoDublagem.prototype, "detalhePecas", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ name: 'createdAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], DetalheProducaoDublagem.prototype, "createAt", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], DetalheProducaoDublagem.prototype, "updateAt", void 0);
    DetalheProducaoDublagem = __decorate([
        (0, typeorm_1.Entity)({ name: 'detalheproducaodublagens' })
    ], DetalheProducaoDublagem);
    return DetalheProducaoDublagem;
}());
exports.default = DetalheProducaoDublagem;
//# sourceMappingURL=detalheProducaoDublagem.entity.js.map