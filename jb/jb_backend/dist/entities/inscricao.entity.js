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
var atleta_entity_1 = require("./atleta.entity");
var cao_entity_1 = require("./cao.entity");
var categoria_entity_1 = require("./categoria.entity");
var prova_entity_1 = require("./prova.entity");
var InscricaoTypes_1 = require("../types/InscricaoTypes");
var sumula_entity_1 = require("./sumula.entity");
var Inscricao = /** @class */ (function () {
    function Inscricao() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
        (0, typeorm_1.Generated)('uuid'),
        __metadata("design:type", String)
    ], Inscricao.prototype, "idInscricao", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 36 }),
        __metadata("design:type", String)
    ], Inscricao.prototype, "idAtleta", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idAtleta' }),
        (0, typeorm_1.ManyToOne)(function () { return atleta_entity_1.default; }, function (atleta) { return atleta.inscricoes; }),
        __metadata("design:type", atleta_entity_1.default)
    ], Inscricao.prototype, "atleta", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 36 }),
        __metadata("design:type", String)
    ], Inscricao.prototype, "idCao", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idCao' }),
        (0, typeorm_1.ManyToOne)(function () { return cao_entity_1.default; }, function (cao) { return cao.inscricoes; }),
        __metadata("design:type", cao_entity_1.default)
    ], Inscricao.prototype, "cao", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 36 }),
        __metadata("design:type", String)
    ], Inscricao.prototype, "idCategoria", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idCategoria' }),
        (0, typeorm_1.ManyToOne)(function () { return categoria_entity_1.default; }, function (categoria) { return categoria.inscricoes; }),
        __metadata("design:type", categoria_entity_1.default)
    ], Inscricao.prototype, "categoria", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 36 }),
        __metadata("design:type", String)
    ], Inscricao.prototype, "idProva", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idProva' }),
        (0, typeorm_1.ManyToOne)(function () { return prova_entity_1.default; }, function (prova) { return prova.inscricoes; }),
        __metadata("design:type", prova_entity_1.default)
    ], Inscricao.prototype, "prova", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
        __metadata("design:type", Number)
    ], Inscricao.prototype, "valor", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'enum', enum: InscricaoTypes_1.InscricaoTypes }),
        __metadata("design:type", Number)
    ], Inscricao.prototype, "statusInscricao", void 0);
    __decorate([
        (0, typeorm_1.OneToOne)(function () { return sumula_entity_1.default; }, function (sumula) { return sumula.inscricao; }),
        (0, typeorm_1.JoinColumn)({ name: 'idSumula' }),
        __metadata("design:type", sumula_entity_1.default)
    ], Inscricao.prototype, "sumula", void 0);
    Inscricao = __decorate([
        (0, typeorm_1.Entity)({ name: 'inscricoes' })
    ], Inscricao);
    return Inscricao;
}());
exports.default = Inscricao;
//# sourceMappingURL=inscricao.entity.js.map