"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusTypes = exports.StatusType = void 0;
var StatusType;
(function (StatusType) {
    StatusType[StatusType["pendente"] = 1] = "pendente";
    StatusType[StatusType["em_analise"] = 2] = "em_analise";
    StatusType[StatusType["aprovado"] = 3] = "aprovado";
    StatusType[StatusType["em_separacao"] = 4] = "em_separacao";
    StatusType[StatusType["enviado"] = 5] = "enviado";
    StatusType[StatusType["entregue"] = 6] = "entregue";
    StatusType[StatusType["cancelado"] = 7] = "cancelado";
})(StatusType || (exports.StatusType = StatusType = {}));
exports.StatusTypes = [
    {
        idStatus: StatusType.pendente,
        descricao: 'Pendente'
    },
    {
        idStatus: StatusType.em_analise,
        descricao: 'Em Análise'
    },
    {
        idStatus: StatusType.aprovado,
        descricao: 'Aprovado'
    },
    {
        idStatus: StatusType.em_separacao,
        descricao: 'Em Separação'
    },
    {
        idStatus: StatusType.enviado,
        descricao: 'Enviado'
    },
    {
        idStatus: StatusType.entregue,
        descricao: 'Entregue'
    },
    {
        idStatus: StatusType.cancelado,
        descricao: 'Cancelado'
    }
];
//# sourceMappingURL=status.js.map