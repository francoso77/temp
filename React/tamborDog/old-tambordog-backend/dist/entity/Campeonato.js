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
var Prova_1 = require("./Prova");
var Campeonato = /** @class */ (function () {
    function Campeonato() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
        (0, typeorm_1.Generated)('uuid'),
        __metadata("design:type", String)
    ], Campeonato.prototype, "idCampeonato", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 35 }),
        __metadata("design:type", String)
    ], Campeonato.prototype, "nomeCampeonato", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'text' }),
        __metadata("design:type", String)
    ], Campeonato.prototype, "descritivo", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true }),
        __metadata("design:type", Boolean)
    ], Campeonato.prototype, "ativo", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 150 }),
        __metadata("design:type", String)
    ], Campeonato.prototype, "pdfFile", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return Prova_1.default; }, function (prova) { return prova.campeonato; }),
        __metadata("design:type", Array)
    ], Campeonato.prototype, "provas", void 0);
    Campeonato = __decorate([
        (0, typeorm_1.Entity)({ name: 'campeonatos' })
    ], Campeonato);
    return Campeonato;
}());
exports.default = Campeonato;
//# sourceMappingURL=Campeonato.js.map