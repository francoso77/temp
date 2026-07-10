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
var pedidoMalharia_entity_1 = require("./pedidoMalharia.entity");
var DetalhePedidoMalharia = /** @class */ (function () {
    function DetalhePedidoMalharia() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], DetalhePedidoMalharia.prototype, "idDetalhePedido", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], DetalhePedidoMalharia.prototype, "idPedido", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idPedido' }),
        (0, typeorm_1.ManyToOne)(function () { return pedidoMalharia_entity_1.default; }, function (pedido) { return pedido.detalhePedidoMalharias; }, {
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            orphanedRowAction: 'delete'
        }),
        __metadata("design:type", pedidoMalharia_entity_1.default)
    ], DetalhePedidoMalharia.prototype, "pedidoMalharia", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], DetalhePedidoMalharia.prototype, "idProduto", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idProduto' }),
        (0, typeorm_1.ManyToOne)(function () { return produto_entity_1.default; }),
        __metadata("design:type", produto_entity_1.default)
    ], DetalhePedidoMalharia.prototype, "produto", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'float', precision: 4 }),
        __metadata("design:type", Number)
    ], DetalhePedidoMalharia.prototype, "qtdPedida", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'float', precision: 4 }),
        __metadata("design:type", Number)
    ], DetalhePedidoMalharia.prototype, "vrUnitario", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ name: 'createdAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], DetalhePedidoMalharia.prototype, "createAt", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], DetalhePedidoMalharia.prototype, "updateAt", void 0);
    DetalhePedidoMalharia = __decorate([
        (0, typeorm_1.Entity)({ name: 'detalhepedidomalharias' }),
        (0, typeorm_1.Index)('IDX_PEDIDO', ['idPedido']),
        (0, typeorm_1.Index)('IDX_PRODUTO', ['idProduto']),
        (0, typeorm_1.Index)('IDX_PEDIDO_PRODUTO', ['idPedido', 'idProduto'])
    ], DetalhePedidoMalharia);
    return DetalhePedidoMalharia;
}());
exports.default = DetalhePedidoMalharia;
//# sourceMappingURL=detalhePedidoMalharia.entity.js.map