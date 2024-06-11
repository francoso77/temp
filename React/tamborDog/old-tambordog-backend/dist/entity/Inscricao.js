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
var Sumula_1 = require("./Sumula");
var Categoria_1 = require("./Categoria");
var Prova_1 = require("./Prova");
var Atleta_1 = require("./Atleta");
var Cao_1 = require("./Cao");
var InscricaoTypes_1 = require("../types/InscricaoTypes");
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
        (0, typeorm_1.ManyToOne)(function () { return Atleta_1.default; }, function (atleta) { return atleta.inscricoes; }),
        __metadata("design:type", Atleta_1.default)
    ], Inscricao.prototype, "atleta", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 36 }),
        __metadata("design:type", String)
    ], Inscricao.prototype, "idCao", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idCao' }),
        (0, typeorm_1.ManyToOne)(function () { return Cao_1.default; }, function (cao) { return cao.inscricoes; }),
        __metadata("design:type", Cao_1.default)
    ], Inscricao.prototype, "cao", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 36 }),
        __metadata("design:type", String)
    ], Inscricao.prototype, "idCategoria", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idCategoria' }),
        (0, typeorm_1.ManyToOne)(function () { return Categoria_1.default; }, function (categoria) { return categoria.inscricoes; }),
        __metadata("design:type", Categoria_1.default)
    ], Inscricao.prototype, "categoria", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 36 }),
        __metadata("design:type", String)
    ], Inscricao.prototype, "idProva", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idProva' }),
        (0, typeorm_1.ManyToOne)(function () { return Prova_1.default; }, function (prova) { return prova.inscricoes; }),
        __metadata("design:type", Prova_1.default)
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
        (0, typeorm_1.OneToOne)(function () { return Sumula_1.default; }, function (sumula) { return sumula.inscricao; }),
        (0, typeorm_1.JoinColumn)({ name: 'idSumula' }),
        __metadata("design:type", Sumula_1.default)
    ], Inscricao.prototype, "sumula", void 0);
    Inscricao = __decorate([
        (0, typeorm_1.Entity)({ name: 'inscricoes' })
    ], Inscricao);
    return Inscricao;
}());
exports.default = Inscricao;
//# sourceMappingURL=Inscricao.js.map