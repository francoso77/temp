"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PessoaTypes = exports.PessoaType = void 0;
var PessoaType;
(function (PessoaType) {
    PessoaType["clienteFisica"] = "C";
    PessoaType["clienteJuridica"] = "J";
    PessoaType["fornecedor"] = "F";
    PessoaType["vendedor"] = "V";
    PessoaType["revisador"] = "R";
    PessoaType["tecelao"] = "T";
})(PessoaType || (exports.PessoaType = PessoaType = {}));
exports.PessoaTypes = [
    {
        idPessoaType: PessoaType.clienteFisica,
        descricao: 'Cliente Pessoa Física'
    },
    {
        idPessoaType: PessoaType.clienteJuridica,
        descricao: 'Cliente Pessoa Jurídica'
    },
    {
        idPessoaType: PessoaType.fornecedor,
        descricao: 'Fornecedor'
    },
    {
        idPessoaType: PessoaType.revisador,
        descricao: 'Revisador'
    },
    {
        idPessoaType: PessoaType.tecelao,
        descricao: 'Tecelão'
    },
    {
        idPessoaType: PessoaType.vendedor,
        descricao: 'Vendedor'
    },
];
//# sourceMappingURL=pessoaTypes%20copy.js.map