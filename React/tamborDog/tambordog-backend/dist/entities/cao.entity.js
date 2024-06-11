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
var raca_entity_1 = require("./raca.entity");
var categoria_entity_1 = require("./categoria.entity");
var inscricao_entity_1 = require("./inscricao.entity");
var Cao = /** @class */ (function () {
    function Cao() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
        (0, typeorm_1.Generated)('uuid'),
        __metadata("design:type", String)
    ], Cao.prototype, "idCao", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 60 }),
        __metadata("design:type", String)
    ], Cao.prototype, "nome", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'date' }),
        __metadata("design:type", String)
    ], Cao.prototype, "dataNascimento", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: false }),
        __metadata("design:type", Boolean)
    ], Cao.prototype, "ativo", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            nullable: true,
            length: 155
        }),
        __metadata("design:type", String)
    ], Cao.prototype, "avatar", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 36 }),
        __metadata("design:type", String)
    ], Cao.prototype, "idAtleta", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idAtleta' }),
        (0, typeorm_1.ManyToOne)(function () { return atleta_entity_1.default; }, function (atleta) { return atleta.caes; }),
        __metadata("design:type", atleta_entity_1.default)
    ], Cao.prototype, "atleta", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 36 }),
        __metadata("design:type", String)
    ], Cao.prototype, "idRaca", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idRaca' }),
        (0, typeorm_1.ManyToOne)(function () { return raca_entity_1.default; }, function (raca) { return raca.caes; }),
        __metadata("design:type", raca_entity_1.default)
    ], Cao.prototype, "raca", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 36 }),
        __metadata("design:type", String)
    ], Cao.prototype, "idCategoria", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idCategoria' }),
        (0, typeorm_1.ManyToOne)(function () { return categoria_entity_1.default; }, function (categoria) { return categoria.caes; }),
        __metadata("design:type", categoria_entity_1.default)
    ], Cao.prototype, "categoria", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return inscricao_entity_1.default; }, function (inscricao) { return inscricao.cao; }),
        __metadata("design:type", Array)
    ], Cao.prototype, "inscricoes", void 0);
    Cao = __decorate([
        (0, typeorm_1.Entity)({ name: 'caes' })
    ], Cao);
    return Cao;
}());
exports.default = Cao;
//# sourceMappingURL=cao.entity.js.map