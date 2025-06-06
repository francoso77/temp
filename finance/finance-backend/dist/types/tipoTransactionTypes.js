"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TipoTransactionTypes = exports.TipoTransactionType = void 0;
var TipoTransactionType;
(function (TipoTransactionType) {
    TipoTransactionType["Receita"] = "Receita";
    TipoTransactionType["Despesa"] = "Despesa";
})(TipoTransactionType || (exports.TipoTransactionType = TipoTransactionType = {}));
exports.TipoTransactionTypes = [
    {
        idTipoTransactionType: TipoTransactionType.Receita,
        descricao: 'Receita'
    },
    {
        idTipoTransactionType: TipoTransactionType.Despesa,
        descricao: 'Despesa'
    },
];
//# sourceMappingURL=tipoTransactionTypes.js.map