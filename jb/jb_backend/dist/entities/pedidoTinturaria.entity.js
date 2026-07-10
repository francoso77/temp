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
var pessoa_entity_1 = require("./pessoa.entity");
var statusTypes_1 = require("../types/statusTypes");
var detalhePedidoTinturaria_entity_1 = require("./detalhePedidoTinturaria.entity");
var PedidoTinturaria = /** @class */ (function () {
    function PedidoTinturaria() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], PedidoTinturaria.prototype, "idPedido", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "datetime" }),
        (0, typeorm_1.Index)(),
        __metadata("design:type", String)
    ], PedidoTinturaria.prototype, "dataPedido", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true, length: 60 }),
        __metadata("design:type", String)
    ], PedidoTinturaria.prototype, "observacao", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], PedidoTinturaria.prototype, "idPessoa_cliente", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idPessoa_cliente' }),
        (0, typeorm_1.ManyToOne)(function () { return pessoa_entity_1.default; }),
        __metadata("design:type", pessoa_entity_1.default)
    ], PedidoTinturaria.prototype, "cliente", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], PedidoTinturaria.prototype, "idPessoa_fornecedor", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idPessoa_fornecedor' }),
        (0, typeorm_1.ManyToOne)(function () { return pessoa_entity_1.default; }),
        __metadata("design:type", pessoa_entity_1.default)
    ], PedidoTinturaria.prototype, "fornecedor", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idPedido' }),
        (0, typeorm_1.OneToMany)(function () { return detalhePedidoTinturaria_entity_1.default; }, function (detalhePedido) { return detalhePedido.pedidoTinturaria; }, { cascade: true }),
        __metadata("design:type", Array)
    ], PedidoTinturaria.prototype, "detalhePedidoTinturarias", void 0);
    __decorate([
        (0, typeorm_1.Column)({}),
        __metadata("design:type", Number)
    ], PedidoTinturaria.prototype, "statusPedido", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ name: 'createdAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], PedidoTinturaria.prototype, "createAt", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], PedidoTinturaria.prototype, "updateAt", void 0);
    PedidoTinturaria = __decorate([
        (0, typeorm_1.Entity)({ name: 'pedidos' }),
        (0, typeorm_1.Index)('IDX_CLIENTE', ['idPessoa_cliente']),
        (0, typeorm_1.Index)('IDX_FORNECEDOR', ['idPessoa_fornecedor']),
        (0, typeorm_1.Index)('IDX_STATUS', ['statusPedido']),
        (0, typeorm_1.Index)('IDX_STATUS_DATA', ['statusPedido', 'dataPedido']),
        (0, typeorm_1.Index)('IDX_CLIENTE_STATUS', ['idPessoa_cliente', 'statusPedido'])
    ], PedidoTinturaria);
    return PedidoTinturaria;
}());
exports.default = PedidoTinturaria;
//# sourceMappingURL=pedidoTinturaria.entity.js.map