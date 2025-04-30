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
exports.GrupoPermissao = void 0;
var typeorm_1 = require("typeorm");
var grupo_entity_1 = require("./grupo.entity");
var moduloPermissao_entity_1 = require("./moduloPermissao.entity");
var GrupoPermissao = /** @class */ (function () {
    function GrupoPermissao() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], GrupoPermissao.prototype, "idGrupoPermissao", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idGrupo' }),
        (0, typeorm_1.ManyToOne)(function () { return grupo_entity_1.Grupo; }),
        __metadata("design:type", Number)
    ], GrupoPermissao.prototype, "idGrupo", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idModuloPermissao' }),
        (0, typeorm_1.ManyToOne)(function () { return moduloPermissao_entity_1.ModuloPermissao; }),
        __metadata("design:type", Number)
    ], GrupoPermissao.prototype, "idModuloPermissao", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ name: 'createdAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], GrupoPermissao.prototype, "createAt", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], GrupoPermissao.prototype, "updateAt", void 0);
    GrupoPermissao = __decorate([
        (0, typeorm_1.Entity)({ name: 'grupospermissoes' })
    ], GrupoPermissao);
    return GrupoPermissao;
}());
exports.GrupoPermissao = GrupoPermissao;
//# sourceMappingURL=grupoPermissao.entity.js.map