"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusProvaTypes = exports.StatusProvaType = exports.ProvaTypes = void 0;
var ProvaTypes;
(function (ProvaTypes) {
    ProvaTypes["recebendoInscricoes"] = "Recebendo Inscri\u00E7\u00F5es";
    ProvaTypes["InscricoesEncerradas"] = "Inscri\u00E7\u00F5es Encerradas";
    ProvaTypes["emAndamento"] = "Em Andamento";
    ProvaTypes["concluida"] = "Conclu\u00EDda";
})(ProvaTypes || (exports.ProvaTypes = ProvaTypes = {}));
var StatusProvaType;
(function (StatusProvaType) {
    StatusProvaType["inscAberta"] = "RI";
    StatusProvaType["inscEncerrada"] = "IE";
    StatusProvaType["emAndamento"] = "EA";
    StatusProvaType["concluida"] = "CL";
    StatusProvaType["cancelada"] = "CC";
})(StatusProvaType || (exports.StatusProvaType = StatusProvaType = {}));
exports.StatusProvaTypes = [
    {
        idStatusProva: StatusProvaType.inscAberta,
        descricao: "Inscrições Abertas",
    },
    {
        idStatusProva: StatusProvaType.inscEncerrada,
        descricao: "Inscrições Encerradas",
    },
    {
        idStatusProva: StatusProvaType.emAndamento,
        descricao: "Em Andamento",
    },
    {
        idStatusProva: StatusProvaType.concluida,
        descricao: "Concluída",
    },
    {
        idStatusProva: StatusProvaType.cancelada,
        descricao: "Cancelada",
    },
];
//# sourceMappingURL=provaTypes.js.map