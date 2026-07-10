"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusRomaneioTypes = exports.StatusRomaneioType = void 0;
var StatusRomaneioType;
(function (StatusRomaneioType) {
    StatusRomaneioType[StatusRomaneioType["todos"] = 0] = "todos";
    StatusRomaneioType[StatusRomaneioType["programado"] = 1] = "programado";
    StatusRomaneioType[StatusRomaneioType["naoProgramado"] = 2] = "naoProgramado";
})(StatusRomaneioType || (exports.StatusRomaneioType = StatusRomaneioType = {}));
exports.StatusRomaneioTypes = [
    {
        idStatus: StatusRomaneioType.todos,
        descricao: 'Todos'
    },
    {
        idStatus: StatusRomaneioType.programado,
        descricao: 'Programado'
    },
    {
        idStatus: StatusRomaneioType.naoProgramado,
        descricao: 'Não Programado'
    },
];
//# sourceMappingURL=statusRomaneioTypes.js.map