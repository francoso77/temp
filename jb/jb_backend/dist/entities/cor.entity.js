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
var estoque_entity_1 = require("./estoque.entity");
var detalheProgramacao_entity_1 = require("./detalheProgramacao.entity");
var Cor = /** @class */ (function () {
    function Cor() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], Cor.prototype, "idCor", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 35 }),
        __metadata("design:type", String)
    ], Cor.prototype, "nome", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: "idCor" }),
        (0, typeorm_1.OneToMany)(function () { return detalheEntrada_entity_1.default; }, function (detalheEntrada) {
            return detalheEntrada.cor;
        }, { cascade: true }),
        __metadata("design:type", Array)
    ], Cor.prototype, "corDetalheEntradas", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: "idCor" }),
        (0, typeorm_1.OneToMany)(function () { return detalheProgramacao_entity_1.default; }, function (detalheProgramacao) {
            return detalheProgramacao.cor;
        }, { cascade: true }),
        __metadata("design:type", Array)
    ], Cor.prototype, "corDetalheProgramacoes", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: "idCor" }),
        (0, typeorm_1.OneToMany)(function () { return estoque_entity_1.default; }, function (estoque) {
            return estoque.cor;
        }, { cascade: true }),
        __metadata("design:type", Array)
    ], Cor.prototype, "corEstoques", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ name: 'createdAt', type: 'timestamp' }),
        __metadata("design:type", Date)
    ], Cor.prototype, "createAD", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt', type: 'timestamp' }),
        __metadata("design:type", Date)
    ], Cor.prototype, "updateAD", void 0);
    Cor = __decorate([
        (0, typeorm_1.Entity)({ name: 'cores' })
    ], Cor);
    return Cor;
}());
exports.default = Cor;
//# sourceMappingURL=cor.entity.js.map