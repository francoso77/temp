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
exports.UsuarioPermissao = void 0;
var typeorm_1 = require("typeorm");
var usuario_entity_1 = require("./usuario.entity");
var moduloPermissao_entity_1 = require("./moduloPermissao.entity");
var UsuarioPermissao = /** @class */ (function () {
    function UsuarioPermissao() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], UsuarioPermissao.prototype, "idUsuarioPermissao", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idUsuario' }),
        (0, typeorm_1.ManyToOne)(function () { return usuario_entity_1.Usuario; }),
        __metadata("design:type", Number)
    ], UsuarioPermissao.prototype, "idUsuario", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idModuloPermissao' }),
        (0, typeorm_1.ManyToOne)(function () { return moduloPermissao_entity_1.ModuloPermissao; }),
        __metadata("design:type", Number)
    ], UsuarioPermissao.prototype, "idModuloPermissao", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ name: 'createdAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], UsuarioPermissao.prototype, "createAt", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], UsuarioPermissao.prototype, "updateAt", void 0);
    UsuarioPermissao = __decorate([
        (0, typeorm_1.Entity)({ name: 'usuariospermissoes' })
    ], UsuarioPermissao);
    return UsuarioPermissao;
}());
exports.UsuarioPermissao = UsuarioPermissao;
//# sourceMappingURL=usuarioPermissao.entity.js.map