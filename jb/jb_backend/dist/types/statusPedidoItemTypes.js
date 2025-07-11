"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusPedidoItemTypes = exports.StatusPedidoItemType = void 0;
var StatusPedidoItemType;
(function (StatusPedidoItemType) {
    StatusPedidoItemType["aberto"] = "A";
    StatusPedidoItemType["producao"] = "C";
    StatusPedidoItemType["finalizado"] = "F";
    StatusPedidoItemType["parcial"] = "P";
})(StatusPedidoItemType || (exports.StatusPedidoItemType = StatusPedidoItemType = {}));
exports.StatusPedidoItemTypes = [
    {
        idStatusPedidoItem: StatusPedidoItemType.aberto,
        descricao: 'Em aberto'
    },
    {
        idStatusPedidoItem: StatusPedidoItemType.producao,
        descricao: 'Em produção'
    },
    {
        idStatusPedidoItem: StatusPedidoItemType.finalizado,
        descricao: 'Finalizado'
    },
    {
        idStatusPedidoItem: StatusPedidoItemType.parcial,
        descricao: 'Parcial'
    },
];
//# sourceMappingURL=statusPedidoItemTypes.js.map