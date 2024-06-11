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
var Cao_1 = require("./Cao");
var Inscricao_1 = require("./Inscricao");
var Atleta = /** @class */ (function () {
    function Atleta() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
        (0, typeorm_1.Generated)('uuid'),
        __metadata("design:type", String)
    ], Atleta.prototype, "idAtleta", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 60 }),
        __metadata("design:type", String)
    ], Atleta.prototype, "nome", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 14 }),
        __metadata("design:type", String)
    ], Atleta.prototype, "cpf", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'date' }),
        __metadata("design:type", String)
    ], Atleta.prototype, "dataNascimento", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            length: 15,
            nullable: true,
        }),
        __metadata("design:type", String)
    ], Atleta.prototype, "telefone", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            length: 15,
            nullable: true,
        }),
        __metadata("design:type", String)
    ], Atleta.prototype, "whatsapp", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 255 }),
        __metadata("design:type", String)
    ], Atleta.prototype, "email", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 25 }),
        __metadata("design:type", String)
    ], Atleta.prototype, "senha", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true }),
        __metadata("design:type", Boolean)
    ], Atleta.prototype, "ativo", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            nullable: true,
            length: 155
        }),
        __metadata("design:type", String)
    ], Atleta.prototype, "avatar", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return Cao_1.default; }, function (cao) { return cao.atleta; }),
        __metadata("design:type", Array)
    ], Atleta.prototype, "caes", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return Inscricao_1.default; }, function (inscricao) { return inscricao.atleta; }),
        __metadata("design:type", Array)
    ], Atleta.prototype, "inscricoes", void 0);
    Atleta = __decorate([
        (0, typeorm_1.Entity)({ name: 'atletas' })
    ], Atleta);
    return Atleta;
}());
exports.default = Atleta;
//# sourceMappingURL=Atleta.js.map