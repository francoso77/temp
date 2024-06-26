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
var inscricao_entity_1 = require("./inscricao.entity");
var SumulaTypes_1 = require("../types/SumulaTypes");
var Sumula = /** @class */ (function () {
    function Sumula() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
        (0, typeorm_1.Generated)('uuid'),
        __metadata("design:type", String)
    ], Sumula.prototype, "idSumula", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 36 }),
        __metadata("design:type", String)
    ], Sumula.prototype, "idInscricao", void 0);
    __decorate([
        (0, typeorm_1.OneToOne)(function () { return inscricao_entity_1.default; }, function (inscricao) { return inscricao.sumula; }),
        __metadata("design:type", inscricao_entity_1.default)
    ], Sumula.prototype, "inscricao", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'timestamp' }),
        __metadata("design:type", Date)
    ], Sumula.prototype, "tempoPista", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'timestamp' }),
        __metadata("design:type", Date)
    ], Sumula.prototype, "penalidade", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'timestamp' }),
        __metadata("design:type", Date)
    ], Sumula.prototype, "classificacao", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'datetime' }),
        __metadata("design:type", Date)
    ], Sumula.prototype, "dataHoraApuracao", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'int' }),
        __metadata("design:type", Number)
    ], Sumula.prototype, "ordemEntrada", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'enum', enum: SumulaTypes_1.SumulaTypes }),
        __metadata("design:type", Number)
    ], Sumula.prototype, "statusSumula", void 0);
    Sumula = __decorate([
        (0, typeorm_1.Entity)({ name: 'sumulas' })
    ], Sumula);
    return Sumula;
}());
exports.default = Sumula;
//# sourceMappingURL=sumula.entity.js.map