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
var statusPedidoItemTypes_1 = require("../types/statusPedidoItemTypes");
var pedido_entity_1 = require("./pedido.entity");
var DetalhePedido = /** @class */ (function () {
    function DetalhePedido() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], DetalhePedido.prototype, "idDetalhePedido", void 0);
    __decorate([
        (0, typeorm_1.PrimaryColumn)(),
        __metadata("design:type", Number)
    ], DetalhePedido.prototype, "idPedido", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idPedido' }),
        (0, typeorm_1.ManyToOne)(function () { return pedido_entity_1.default; }, function (pedido) { return pedido.detalhePedidos; }, {
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            orphanedRowAction: 'delete'
        }),
        __metadata("design:type", pedido_entity_1.default)
    ], DetalhePedido.prototype, "pedido", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], DetalhePedido.prototype, "idProduto", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idProduto' }),
        (0, typeorm_1.ManyToOne)(function () { return produto_entity_1.default; }),
        __metadata("design:type", produto_entity_1.default)
    ], DetalhePedido.prototype, "produto", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'float', precision: 4 }),
        __metadata("design:type", Number)
    ], DetalhePedido.prototype, "qtdPedida", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'float', precision: 4 }),
        __metadata("design:type", Number)
    ], DetalhePedido.prototype, "vrUnitario", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'float', precision: 4 }),
        __metadata("design:type", Number)
    ], DetalhePedido.prototype, "qtdAtendida", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], DetalhePedido.prototype, "statusItem", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ name: 'createdAt', type: 'timestamp' }),
        __metadata("design:type", Date)
    ], DetalhePedido.prototype, "createAD", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt', type: 'timestamp' }),
        __metadata("design:type", Date)
    ], DetalhePedido.prototype, "updateAD", void 0);
    DetalhePedido = __decorate([
        (0, typeorm_1.Entity)({ name: 'detalhepedidos' })
    ], DetalhePedido);
    return DetalhePedido;
}());
exports.default = DetalhePedido;
//# sourceMappingURL=detalhePedido.entity.js.map