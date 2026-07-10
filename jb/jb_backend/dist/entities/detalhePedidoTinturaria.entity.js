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
var produto_entity_1 = require("./produto.entity");
var pedidoTinturaria_entity_1 = require("./pedidoTinturaria.entity");
var DetalhePedidoTinturaria = /** @class */ (function () {
    function DetalhePedidoTinturaria() {
    }
    var _a;
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], DetalhePedidoTinturaria.prototype, "idDetalhePedido", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], DetalhePedidoTinturaria.prototype, "idPedido", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idPedido' }),
        (0, typeorm_1.ManyToOne)(function () { return pedidoTinturaria_entity_1.default; }, function (pedido) { return pedido.detalhePedidoTinturarias; }, {
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            orphanedRowAction: 'delete'
        }),
        __metadata("design:type", typeof (_a = typeof pedidoTinturaria_entity_1.default !== "undefined" && pedidoTinturaria_entity_1.default) === "function" ? _a : Object)
    ], DetalhePedidoTinturaria.prototype, "pedidoTinturaria", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], DetalhePedidoTinturaria.prototype, "idProduto", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idProduto' }),
        (0, typeorm_1.ManyToOne)(function () { return produto_entity_1.default; }),
        __metadata("design:type", produto_entity_1.default)
    ], DetalhePedidoTinturaria.prototype, "produto", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'float', precision: 4 }),
        __metadata("design:type", Number)
    ], DetalhePedidoTinturaria.prototype, "qtdPedida", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'float', precision: 4 }),
        __metadata("design:type", Number)
    ], DetalhePedidoTinturaria.prototype, "vrUnitario", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ name: 'createdAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], DetalhePedidoTinturaria.prototype, "createAt", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], DetalhePedidoTinturaria.prototype, "updateAt", void 0);
    DetalhePedidoTinturaria = __decorate([
        (0, typeorm_1.Entity)({ name: 'detalhepedidos' }),
        (0, typeorm_1.Index)('IDX_PEDIDO', ['idPedido']),
        (0, typeorm_1.Index)('IDX_PRODUTO', ['idProduto']),
        (0, typeorm_1.Index)('IDX_PEDIDO_PRODUTO', ['idPedido', 'idProduto']),
        (0, typeorm_1.Index)('IDX_PRODUTO_STATUS', ['idProduto', 'statusItem'])
    ], DetalhePedidoTinturaria);
    return DetalhePedidoTinturaria;
}());
exports.default = DetalhePedidoTinturaria;
//# sourceMappingURL=detalhePedidoTinturaria.entity.js.map