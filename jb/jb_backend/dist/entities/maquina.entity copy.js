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
var Maquina = /** @class */ (function () {
    function Maquina() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], Maquina.prototype, "idMaquina", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 35 }),
        __metadata("design:type", String)
    ], Maquina.prototype, "nome", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 15 }),
        __metadata("design:type", String)
    ], Maquina.prototype, "marca", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 15 }),
        __metadata("design:type", String)
    ], Maquina.prototype, "tipoTear", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: false }),
        __metadata("design:type", Boolean)
    ], Maquina.prototype, "kitElastano", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 15 }),
        __metadata("design:type", String)
    ], Maquina.prototype, "modelo", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 15 }),
        __metadata("design:type", String)
    ], Maquina.prototype, "serie", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], Maquina.prototype, "qtdAgulhas", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], Maquina.prototype, "qtdAlimentadores", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], Maquina.prototype, "diametro", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], Maquina.prototype, "espessura", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 15 }),
        __metadata("design:type", String)
    ], Maquina.prototype, "platina", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 15 }),
        __metadata("design:type", String)
    ], Maquina.prototype, "correia", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 15 }),
        __metadata("design:type", String)
    ], Maquina.prototype, "agulha", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "datetime" }),
        __metadata("design:type", String)
    ], Maquina.prototype, "dataPreventiva", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: false }),
        __metadata("design:type", Boolean)
    ], Maquina.prototype, "ativo", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ name: 'createdAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], Maquina.prototype, "createAD", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], Maquina.prototype, "updateAD", void 0);
    Maquina = __decorate([
        (0, typeorm_1.Entity)({ name: 'maquinas' })
    ], Maquina);
    return Maquina;
}());
exports.default = Maquina;
//# sourceMappingURL=maquina.entity%20copy.js.map