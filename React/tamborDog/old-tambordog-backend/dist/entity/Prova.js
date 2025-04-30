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
var Inscricao_1 = require("./Inscricao");
var Campeonato_1 = require("./Campeonato");
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
        (0, typeorm_1.Column)({ length: 30 }),
        __metadata("design:type", String)
    ], Prova.prototype, "localizacao", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 255 }),
        __metadata("design:type", String)
    ], Prova.prototype, "adicionais", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'enum', enum: PisoTypes_1.PisoTypes }),
        __metadata("design:type", String)
    ], Prova.prototype, "piso", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'date' }),
        __metadata("design:type", String)
    ], Prova.prototype, "dataProva", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'time' }),
        __metadata("design:type", String)
    ], Prova.prototype, "horaProva", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
        __metadata("design:type", Number)
    ], Prova.prototype, "valorProva", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
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
        (0, typeorm_1.Column)({ type: 'enum', enum: ProvaTypes_1.ProvaTypes }),
        __metadata("design:type", String)
    ], Prova.prototype, "status", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return Inscricao_1.default; }, function (inscricao) { return inscricao.prova; }),
        __metadata("design:type", Array)
    ], Prova.prototype, "inscricoes", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 36 }),
        __metadata("design:type", String)
    ], Prova.prototype, "idCampeonato", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idCampeonato' }),
        (0, typeorm_1.ManyToOne)(function () { return Campeonato_1.default; }, function (campeonato) { return campeonato.provas; }),
        __metadata("design:type", Campeonato_1.default)
    ], Prova.prototype, "campeonato", void 0);
    Prova = __decorate([
        (0, typeorm_1.Entity)({ name: 'provas' })
    ], Prova);
    return Prova;
}());
exports.default = Prova;
//# sourceMappingURL=Prova.js.map