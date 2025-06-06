"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusPedidoTypes = exports.StatusPedidoType = void 0;
var StatusPedidoType;
(function (StatusPedidoType) {
    StatusPedidoType["aberto"] = "A";
    StatusPedidoType["producao"] = "C";
    StatusPedidoType["finalizado"] = "F";
    StatusPedidoType["parcial"] = "P";
})(StatusPedidoType || (exports.StatusPedidoType = StatusPedidoType = {}));
exports.StatusPedidoTypes = [
    {
        idStatusPedido: StatusPedidoType.aberto,
        descricao: 'Em aberto'
    },
    {
        idStatusPedido: StatusPedidoType.producao,
        descricao: 'Em produção'
    },
    {
        idStatusPedido: StatusPedidoType.finalizado,
        descricao: 'Finalizado'
    },
    {
        idStatusPedido: StatusPedidoType.parcial,
        descricao: 'Parcial'
    },
];
//# sourceMappingURL=statusPedidoTypes.js.map