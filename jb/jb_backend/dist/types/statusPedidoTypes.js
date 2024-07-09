"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusPedidoTypes = exports.StatusPedidoType = void 0;
var StatusPedidoType;
(function (StatusPedidoType) {
    StatusPedidoType["aberto"] = "A";
    StatusPedidoType["cancelado"] = "C";
    StatusPedidoType["fechado"] = "F";
    StatusPedidoType["parcial"] = "P";
})(StatusPedidoType || (exports.StatusPedidoType = StatusPedidoType = {}));
exports.StatusPedidoTypes = [
    {
        idStatusPedido: StatusPedidoType.aberto,
        descricao: 'Em aberto'
    },
    {
        idStatusPedido: StatusPedidoType.cancelado,
        descricao: 'Cancelado'
    },
    {
        idStatusPedido: StatusPedidoType.fechado,
        descricao: 'Fechado'
    },
    {
        idStatusPedido: StatusPedidoType.parcial,
        descricao: 'Parcial'
    },
];
//# sourceMappingURL=statusPedidoTypes.js.map