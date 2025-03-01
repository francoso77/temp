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
exports.UsuarioSessao = void 0;
var typeorm_1 = require("typeorm");
var usuario_entity_1 = require("./usuario.entity");
var UsuarioSessao = /** @class */ (function () {
    function UsuarioSessao() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], UsuarioSessao.prototype, "idSessao", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idUsuario' }),
        (0, typeorm_1.ManyToOne)(function () { return usuario_entity_1.Usuario; }),
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], UsuarioSessao.prototype, "idUsuario", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], UsuarioSessao.prototype, "token", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Boolean)
    ], UsuarioSessao.prototype, "ativo", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ name: 'createdAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], UsuarioSessao.prototype, "createAt", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], UsuarioSessao.prototype, "updateAt", void 0);
    UsuarioSessao = __decorate([
        (0, typeorm_1.Entity)({ name: 'usuariosessoes' })
    ], UsuarioSessao);
    return UsuarioSessao;
}());
exports.UsuarioSessao = UsuarioSessao;
//# sourceMappingURL=usuarioSessao.entity.js.map