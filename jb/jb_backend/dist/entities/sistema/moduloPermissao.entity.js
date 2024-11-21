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
exports.ModuloPermissao = void 0;
var typeorm_1 = require("typeorm");
var modulo_entity_1 = require("./modulo.entity");
var ModuloPermissao = /** @class */ (function () {
    function ModuloPermissao() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], ModuloPermissao.prototype, "idModuloPermissao", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idModulo' }),
        (0, typeorm_1.ManyToOne)(function () { return modulo_entity_1.Modulo; }),
        __metadata("design:type", Number)
    ], ModuloPermissao.prototype, "idModulo", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 255 }),
        __metadata("design:type", String)
    ], ModuloPermissao.prototype, "permissao", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ name: 'createdAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], ModuloPermissao.prototype, "createAt", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], ModuloPermissao.prototype, "updateAt", void 0);
    ModuloPermissao = __decorate([
        (0, typeorm_1.Entity)({ name: 'modulospermissoes' })
    ], ModuloPermissao);
    return ModuloPermissao;
}());
exports.ModuloPermissao = ModuloPermissao;
//# sourceMappingURL=moduloPermissao.entity.js.map