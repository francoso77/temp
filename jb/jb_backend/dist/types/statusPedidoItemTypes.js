"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusPedidoItemTypes = exports.StatusPedidoItemType = void 0;
var StatusPedidoItemType;
(function (StatusPedidoItemType) {
    StatusPedidoItemType[StatusPedidoItemType["aberto"] = 1] = "aberto";
    StatusPedidoItemType[StatusPedidoItemType["finalizado"] = 2] = "finalizado";
    StatusPedidoItemType[StatusPedidoItemType["producao"] = 3] = "producao";
})(StatusPedidoItemType || (exports.StatusPedidoItemType = StatusPedidoItemType = {}));
exports.StatusPedidoItemTypes = [
    {
        idStatusPedidoItem: StatusPedidoItemType.aberto,
        descricao: 'Em aberto'
    },
    {
        idStatusPedidoItem: StatusPedidoItemType.finalizado,
        descricao: 'Finalizado'
    },
    {
        idStatusPedidoItem: StatusPedidoItemType.producao,
        descricao: 'Em produção'
    },
];
//# sourceMappingURL=statusPedidoItemTypes.js.map