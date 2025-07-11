"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusPedidoTypes = exports.StatusPedidoType = void 0;
var StatusPedidoType;
(function (StatusPedidoType) {
    StatusPedidoType[StatusPedidoType["aberto"] = 1] = "aberto";
    StatusPedidoType[StatusPedidoType["finalizado"] = 2] = "finalizado";
    StatusPedidoType[StatusPedidoType["producao"] = 3] = "producao";
})(StatusPedidoType || (exports.StatusPedidoType = StatusPedidoType = {}));
exports.StatusPedidoTypes = [
    {
        idStatusPedido: StatusPedidoType.aberto,
        descricao: 'Em aberto'
    },
    {
        idStatusPedido: StatusPedidoType.finalizado,
        descricao: 'Finalizado'
    },
    {
        idStatusPedido: StatusPedidoType.producao,
        descricao: 'Em produção'
    },
];
//# sourceMappingURL=statusPedidoTypes.js.map