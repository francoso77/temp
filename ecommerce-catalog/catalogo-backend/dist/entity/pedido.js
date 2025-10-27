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
var cliente_1 = require("./cliente");
var user_1 = require("./sistema/user");
var status_1 = require("../interfaces/types/status");
var detalhePedido_1 = require("./detalhePedido");
var Pedido = /** @class */ (function () {
    function Pedido() {
    }
    __decorate([
        (0, typeorm_1.PrimaryColumn)({ generated: 'uuid' }),
        __metadata("design:type", String)
    ], Pedido.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 9, unique: true }),
        __metadata("design:type", String)
    ], Pedido.prototype, "numeroPedido", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "datetime" }),
        (0, typeorm_1.Index)(),
        __metadata("design:type", String)
    ], Pedido.prototype, "data", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true, length: 60 }),
        __metadata("design:type", String)
    ], Pedido.prototype, "observacoes", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], Pedido.prototype, "idCliente", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idCliente' }),
        (0, typeorm_1.ManyToOne)(function () { return cliente_1.default; }),
        __metadata("design:type", cliente_1.default)
    ], Pedido.prototype, "cliente", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], Pedido.prototype, "idVendedor", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idVendedor' }),
        (0, typeorm_1.ManyToOne)(function () { return user_1.User; }),
        __metadata("design:type", user_1.User)
    ], Pedido.prototype, "vendedor", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'float', scale: 2, default: 0 }),
        __metadata("design:type", Number)
    ], Pedido.prototype, "total", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'float', scale: 2, default: 0 }),
        __metadata("design:type", Number)
    ], Pedido.prototype, "desconto", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'float', scale: 2, default: 0 }),
        __metadata("design:type", Number)
    ], Pedido.prototype, "totalDescontado", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return detalhePedido_1.default; }, function (detalhePedido) { return detalhePedido.pedido; }, {
            cascade: true,
            eager: true,
            orphanedRowAction: 'delete'
        }),
        __metadata("design:type", Array)
    ], Pedido.prototype, "itens", void 0);
    __decorate([
        (0, typeorm_1.Column)({}),
        __metadata("design:type", Number)
    ], Pedido.prototype, "status", void 0);
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
        (0, typeorm_1.Index)('IDX_CLIENTE', ['idCliente']),
        (0, typeorm_1.Index)('IDX_VENDEDOR', ['idVendedor']),
        (0, typeorm_1.Index)('IDX_STATUS', ['status']),
        (0, typeorm_1.Index)('IDX_STATUS_DATA', ['status', 'data']),
        (0, typeorm_1.Index)('IDX_CLIENTE_STATUS', ['idCliente', 'status'])
    ], Pedido);
    return Pedido;
}());
exports.default = Pedido;
//# sourceMappingURL=pedido.js.map