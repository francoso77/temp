"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountTypes = exports.AccountType = void 0;
var AccountType;
(function (AccountType) {
    AccountType["corrente"] = "corrente";
    AccountType["poupanca"] = "poupanca";
    AccountType["investimento"] = "investimento";
    AccountType["credito"] = "credito";
    AccountType["dinheiro"] = "dinheiro";
    AccountType["outros"] = "outros";
})(AccountType || (exports.AccountType = AccountType = {}));
exports.AccountTypes = [
    {
        idAccountType: AccountType.corrente,
        descricao: 'Conta Corrente'
    },
    {
        idAccountType: AccountType.poupanca,
        descricao: 'Conta Poupança'
    },
    {
        idAccountType: AccountType.investimento,
        descricao: 'Conta Investimento'
    },
    {
        idAccountType: AccountType.credito,
        descricao: 'Cartão de Credito'
    },
    {
        idAccountType: AccountType.dinheiro,
        descricao: 'Caixa'
    },
    {
        idAccountType: AccountType.outros,
        descricao: 'Outros'
    },
];
//# sourceMappingURL=accountTypes.js.map