"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusTypes = exports.StatusType = void 0;
var StatusType;
(function (StatusType) {
    StatusType[StatusType["aberto"] = 1] = "aberto";
    StatusType[StatusType["producao"] = 2] = "producao";
    StatusType[StatusType["parcial"] = 3] = "parcial";
    StatusType[StatusType["finalizado"] = 4] = "finalizado";
})(StatusType || (exports.StatusType = StatusType = {}));
exports.StatusTypes = [
    {
        idStatus: StatusType.aberto,
        descricao: 'Em aberto'
    },
    {
        idStatus: StatusType.producao,
        descricao: 'Em produção'
    },
    {
        idStatus: StatusType.parcial,
        descricao: 'Parcial'
    },
    {
        idStatus: StatusType.finalizado,
        descricao: 'Finalizado'
    },
];
//# sourceMappingURL=statusTypes.js.map