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
exports.Usuario = void 0;
var typeorm_1 = require("typeorm");
var usuarioTypes_1 = require("../../types/usuarioTypes");
var Usuario = /** @class */ (function () {
    function Usuario() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], Usuario.prototype, "idUsuario", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 50 }),
        __metadata("design:type", String)
    ], Usuario.prototype, "nome", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 14 }),
        __metadata("design:type", String)
    ], Usuario.prototype, "cpf", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true, length: 255 }),
        (0, typeorm_1.Index)({ unique: true }),
        __metadata("design:type", String)
    ], Usuario.prototype, "email", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 25 }),
        __metadata("design:type", String)
    ], Usuario.prototype, "senha", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true }),
        __metadata("design:type", Boolean)
    ], Usuario.prototype, "ativo", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'int', default: 0 }),
        __metadata("design:type", Number)
    ], Usuario.prototype, "tentativasLogin", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'int', default: 0 }),
        __metadata("design:type", Number)
    ], Usuario.prototype, "tipoUsuario", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Usuario.prototype, "resetToken", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
        __metadata("design:type", Date)
    ], Usuario.prototype, "resetTokenExpires", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ name: 'createdAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], Usuario.prototype, "createAt", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], Usuario.prototype, "updateAt", void 0);
    Usuario = __decorate([
        (0, typeorm_1.Entity)({ name: 'usuarios' })
    ], Usuario);
    return Usuario;
}());
exports.Usuario = Usuario;
//# sourceMappingURL=usuario.entity.js.map