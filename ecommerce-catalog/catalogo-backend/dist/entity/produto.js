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
var categoria_1 = require("./categoria");
var Produto = /** @class */ (function () {
    function Produto() {
    }
    __decorate([
        (0, typeorm_1.PrimaryColumn)({ generated: 'uuid' }),
        __metadata("design:type", String)
    ], Produto.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 100 }),
        __metadata("design:type", String)
    ], Produto.prototype, "nome", void 0);
    __decorate([
        (0, typeorm_1.Column)({}),
        __metadata("design:type", String)
    ], Produto.prototype, "descricao", void 0);
    __decorate([
        (0, typeorm_1.Column)({}),
        __metadata("design:type", String)
    ], Produto.prototype, "caracteristicas", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 4, default: 0 }),
        __metadata("design:type", Number)
    ], Produto.prototype, "preco", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 4, default: 0 }),
        __metadata("design:type", Number)
    ], Produto.prototype, "desconto", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true, length: 255 }),
        __metadata("design:type", String)
    ], Produto.prototype, "imagem", void 0);
    __decorate([
        (0, typeorm_1.Column)({ default: true }),
        __metadata("design:type", Boolean)
    ], Produto.prototype, "ativo", void 0);
    __decorate([
        (0, typeorm_1.Column)({ default: false }),
        __metadata("design:type", Boolean)
    ], Produto.prototype, "promocao", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'int', default: 0 }),
        __metadata("design:type", Number)
    ], Produto.prototype, "maisVendido", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], Produto.prototype, "idCategoria", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idCategoria' }),
        (0, typeorm_1.ManyToOne)(function () { return categoria_1.default; }),
        __metadata("design:type", categoria_1.default)
    ], Produto.prototype, "categoria", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ name: 'createdAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], Produto.prototype, "createAt", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], Produto.prototype, "updateAt", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: false }),
        __metadata("design:type", String)
    ], Produto.prototype, "idVendedor", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idVendedor' }),
        (0, typeorm_1.ManyToOne)(function () { return user_1.User; }),
        __metadata("design:type", user_1.User)
    ], Produto.prototype, "vendedor", void 0);
    Produto = __decorate([
        (0, typeorm_1.Index)(['nome', 'descricao']),
        (0, typeorm_1.Entity)({ name: 'produtos' })
    ], Produto);
    return Produto;
}());
exports.default = Produto;
//# sourceMappingURL=produto.js.map