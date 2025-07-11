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
var prazoEntrega_entity_1 = require("./prazoEntrega.entity");
var detalhePedido_entity_1 = require("./detalhePedido.entity");
var pessoa_entity_1 = require("./pessoa.entity");
var statusPedidoTypes_1 = require("../types/statusPedidoTypes");
var Pedido = /** @class */ (function () {
    function Pedido() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], Pedido.prototype, "idPedido", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "datetime" }),
        (0, typeorm_1.Index)(),
        __metadata("design:type", String)
    ], Pedido.prototype, "dataPedido", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true, length: 60 }),
        __metadata("design:type", String)
    ], Pedido.prototype, "observacao", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], Pedido.prototype, "idPrazoEntrega", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idPrazoEntrega' }),
        (0, typeorm_1.ManyToOne)(function () { return prazoEntrega_entity_1.default; }),
        __metadata("design:type", prazoEntrega_entity_1.default)
    ], Pedido.prototype, "prazoEntrega", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], Pedido.prototype, "idPessoa_cliente", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idPessoa_cliente' }),
        (0, typeorm_1.ManyToOne)(function () { return pessoa_entity_1.default; }),
        __metadata("design:type", pessoa_entity_1.default)
    ], Pedido.prototype, "cliente", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], Pedido.prototype, "idPessoa_vendedor", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idPessoa_vendedor' }),
        (0, typeorm_1.ManyToOne)(function () { return pessoa_entity_1.default; }),
        __metadata("design:type", pessoa_entity_1.default)
    ], Pedido.prototype, "vendedor", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idPedido' }),
        (0, typeorm_1.OneToMany)(function () { return detalhePedido_entity_1.default; }, function (detalhePedido) { return detalhePedido.pedido; }, { cascade: true }),
        __metadata("design:type", Array)
    ], Pedido.prototype, "detalhePedidos", void 0);
    __decorate([
        (0, typeorm_1.Column)({}),
        __metadata("design:type", Number)
    ], Pedido.prototype, "statusPedido", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ name: 'createdAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], Pedido.prototype, "createAt", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], Pedido.prototype, "updateAt", void 0);
    Pedido = __decorate([
        (0, typeorm_1.Entity)({ name: 'pedidos' }),
        (0, typeorm_1.Index)('IDX_CLIENTE', ['idPessoa_cliente']),
        (0, typeorm_1.Index)('IDX_VENDEDOR', ['idPessoa_vendedor']),
        (0, typeorm_1.Index)('IDX_STATUS', ['statusPedido']),
        (0, typeorm_1.Index)('IDX_STATUS_DATA', ['statusPedido', 'dataPedido']),
        (0, typeorm_1.Index)('IDX_CLIENTE_STATUS', ['idPessoa_cliente', 'statusPedido'])
    ], Pedido);
    return Pedido;
}());
exports.default = Pedido;
//# sourceMappingURL=pedido.entity.js.map