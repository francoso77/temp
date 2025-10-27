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
var user_1 = require("./sistema/user");
var Categoria = /** @class */ (function () {
    function Categoria() {
    }
    __decorate([
        (0, typeorm_1.PrimaryColumn)({ generated: 'uuid' }),
        __metadata("design:type", String)
    ], Categoria.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 80 }),
        (0, typeorm_1.Index)(),
        __metadata("design:type", String)
    ], Categoria.prototype, "nome", void 0);
    __decorate([
        (0, typeorm_1.Column)({}),
        __metadata("design:type", String)
    ], Categoria.prototype, "descricao", void 0);
    __decorate([
        (0, typeorm_1.Column)({ default: true }),
        __metadata("design:type", Boolean)
    ], Categoria.prototype, "ativo", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "datetime" }),
        __metadata("design:type", String)
    ], Categoria.prototype, "dataCadastro", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Categoria.prototype, "idVendedor", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idVendedor' }),
        (0, typeorm_1.ManyToOne)(function () { return user_1.User; }),
        __metadata("design:type", user_1.User)
    ], Categoria.prototype, "vendedor", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ name: 'createdAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], Categoria.prototype, "createAt", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], Categoria.prototype, "updateAt", void 0);
    Categoria = __decorate([
        (0, typeorm_1.Index)(['idVendedor', 'nome'], { unique: true }),
        (0, typeorm_1.Entity)({ name: 'categorias' })
    ], Categoria);
    return Categoria;
}());
exports.default = Categoria;
//# sourceMappingURL=categoria.js.map