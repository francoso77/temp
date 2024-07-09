"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusPedidoItemTypes = exports.StatusPedidoItemType = void 0;
var StatusPedidoItemType;
(function (StatusPedidoItemType) {
    StatusPedidoItemType[StatusPedidoItemType["aberto"] = 0] = "aberto";
    StatusPedidoItemType[StatusPedidoItemType["fechado"] = 1] = "fechado";
    StatusPedidoItemType[StatusPedidoItemType["parcial"] = 2] = "parcial";
    StatusPedidoItemType[StatusPedidoItemType["programado"] = 3] = "programado";
})(StatusPedidoItemType || (exports.StatusPedidoItemType = StatusPedidoItemType = {}));
exports.StatusPedidoItemTypes = [
    {
        idStatusPedidoItem: StatusPedidoItemType.aberto,
        descricao: 'Em aberto'
    },
    {
        idStatusPedidoItem: StatusPedidoItemType.fechado,
        descricao: 'Fechado'
    },
    {
        idStatusPedidoItem: StatusPedidoItemType.parcial,
        descricao: 'Parcial'
    },
    {
        idStatusPedidoItem: StatusPedidoItemType.programado,
        descricao: 'Programado'
    },
];
//# sourceMappingURL=statusPedidoItemTypes.js.map