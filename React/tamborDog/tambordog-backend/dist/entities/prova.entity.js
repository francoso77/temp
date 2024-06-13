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
var PisoTypes_1 = require("../types/PisoTypes");
var inscricao_entity_1 = require("./inscricao.entity");
var campeonato_entity_1 = require("./campeonato.entity");
var ProvaTypes_1 = require("../types/ProvaTypes");
var Prova = /** @class */ (function () {
    function Prova() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
        (0, typeorm_1.Generated)('uuid'),
        __metadata("design:type", String)
    ], Prova.prototype, "idProva", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 60 }),
        __metadata("design:type", String)
    ], Prova.prototype, "nomeProva", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 100 }),
        __metadata("design:type", String)
    ], Prova.prototype, "endereco", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], Prova.prototype, "numero", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 60 }),
        __metadata("design:type", String)
    ], Prova.prototype, "bairro", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 60 }),
        __metadata("design:type", String)
    ], Prova.prototype, "cidade", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 2 }),
        __metadata("design:type", String)
    ], Prova.prototype, "uf", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 10 }),
        __metadata("design:type", String)
    ], Prova.prototype, "cep", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 10 }),
        __metadata("design:type", String)
    ], Prova.prototype, "lat", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 10 }),
        __metadata("design:type", String)
    ], Prova.prototype, "long", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 10 }),
        __metadata("design:type", String)
    ], Prova.prototype, "tipoPiso", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'timestamp' }),
        __metadata("design:type", Date)
    ], Prova.prototype, "dataHoraProva", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'float', precision: 2 }),
        __metadata("design:type", Number)
    ], Prova.prototype, "valorProva", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'float', precision: 2, scale: 2 }),
        __metadata("design:type", Number)
    ], Prova.prototype, "valorProvaAte12", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            length: 15,
            nullable: true,
        }),
        __metadata("design:type", String)
    ], Prova.prototype, "telefone", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            length: 15,
            nullable: true,
        }),
        __metadata("design:type", String)
    ], Prova.prototype, "whatsapp", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            length: 255,
            nullable: true,
        }),
        __metadata("design:type", String)
    ], Prova.prototype, "email", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "text" }),
        __metadata("design:type", String)
    ], Prova.prototype, "termoAceite", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 2 }),
        __metadata("design:type", String)
    ], Prova.prototype, "status", void 0);
    __decorate([
        (0, typeorm_1.Column)({ default: false }),
        __metadata("design:type", Boolean)
    ], Prova.prototype, "foto", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return inscricao_entity_1.default; }, function (inscricao) { return inscricao.prova; }),
        __metadata("design:type", Array)
    ], Prova.prototype, "inscricoes", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 36, nullable: true }),
        __metadata("design:type", String)
    ], Prova.prototype, "idCampeonato", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idCampeonato' }),
        (0, typeorm_1.ManyToOne)(function () { return campeonato_entity_1.default; }, function (campeonato) { return campeonato.provas; }),
        __metadata("design:type", campeonato_entity_1.default)
    ], Prova.prototype, "campeonato", void 0);
    Prova = __decorate([
        (0, typeorm_1.Entity)({ name: 'provas' })
    ], Prova);
    return Prova;
}());
exports.default = Prova;
//# sourceMappingURL=prova.entity.js.map