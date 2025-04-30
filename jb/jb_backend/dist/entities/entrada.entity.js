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
var detalheEntrada_entity_1 = require("./detalheEntrada.entity");
var Entrada = /** @class */ (function () {
    function Entrada() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], Entrada.prototype, "idEntrada", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 11 }),
        (0, typeorm_1.Index)(),
        __metadata("design:type", String)
    ], Entrada.prototype, "notaFiscal", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "datetime" }),
        (0, typeorm_1.Index)(),
        __metadata("design:type", String)
    ], Entrada.prototype, "dataEmissao", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true, length: 60 }),
        __metadata("design:type", String)
    ], Entrada.prototype, "observacao", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], Entrada.prototype, "idPessoa_fornecedor", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idPessoa_fornecedor' }),
        (0, typeorm_1.ManyToOne)(function () { return pessoa_entity_1.default; }),
        __metadata("design:type", pessoa_entity_1.default)
    ], Entrada.prototype, "fornecedor", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idEntrada' }),
        (0, typeorm_1.OneToMany)(function () { return detalheEntrada_entity_1.default; }, function (detalheEntrada) { return detalheEntrada.entrada; }, { cascade: true }),
        __metadata("design:type", Array)
    ], Entrada.prototype, "detalheEntradas", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ name: 'createdAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], Entrada.prototype, "createAt", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], Entrada.prototype, "updateAt", void 0);
    Entrada = __decorate([
        (0, typeorm_1.Entity)({ name: 'entradas' })
    ], Entrada);
    return Entrada;
}());
exports.default = Entrada;
//# sourceMappingURL=entrada.entity.js.map