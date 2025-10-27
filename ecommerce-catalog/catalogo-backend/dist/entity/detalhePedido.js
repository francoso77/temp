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
var pedido_1 = require("./pedido");
var produto_1 = require("./produto");
var DetalhePedido = /** @class */ (function () {
    function DetalhePedido() {
    }
    __decorate([
        (0, typeorm_1.PrimaryColumn)({ generated: 'uuid' }),
        __metadata("design:type", String)
    ], DetalhePedido.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], DetalhePedido.prototype, "idPedido", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return pedido_1.default; }, function (pedido) { return pedido.itens; }, {
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        }),
        (0, typeorm_1.JoinColumn)({ name: 'idPedido' }),
        __metadata("design:type", pedido_1.default)
    ], DetalhePedido.prototype, "pedido", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], DetalhePedido.prototype, "idProduto", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idProduto' }),
        (0, typeorm_1.ManyToOne)(function () { return produto_1.default; }),
        __metadata("design:type", produto_1.default)
    ], DetalhePedido.prototype, "produto", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'float', scale: 2 }),
        __metadata("design:type", Number)
    ], DetalhePedido.prototype, "quantidade", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'float', scale: 2, default: 0 }),
        __metadata("design:type", Number)
    ], DetalhePedido.prototype, "preco", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'float', scale: 2, default: 0 }),
        __metadata("design:type", Number)
    ], DetalhePedido.prototype, "subtotal", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ name: 'createdAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], DetalhePedido.prototype, "createAt", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], DetalhePedido.prototype, "updateAt", void 0);
    DetalhePedido = __decorate([
        (0, typeorm_1.Entity)({ name: 'detalhepedidos' }),
        (0, typeorm_1.Index)('IDX_PEDIDO', ['idPedido']),
        (0, typeorm_1.Index)('IDX_PRODUTO', ['idProduto']),
        (0, typeorm_1.Index)('IDX_PEDIDO_PRODUTO', ['idPedido', 'idProduto'])
    ], DetalhePedido);
    return DetalhePedido;
}());
exports.default = DetalhePedido;
//# sourceMappingURL=detalhePedido.js.map