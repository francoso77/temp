"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TurnoTypes = exports.TurnoType = void 0;
var TurnoType;
(function (TurnoType) {
    TurnoType[TurnoType["primeiro"] = 1] = "primeiro";
    TurnoType[TurnoType["segundo"] = 2] = "segundo";
    TurnoType[TurnoType["terceiro"] = 3] = "terceiro";
})(TurnoType || (exports.TurnoType = TurnoType = {}));
exports.TurnoTypes = [
    {
        idTurno: TurnoType.primeiro,
        descricao: 'Primeiro - 22:20 as 05:40'
    },
    {
        idTurno: TurnoType.segundo,
        descricao: 'Segundo - 05:40 as 14:00'
    },
    {
        idTurno: TurnoType.terceiro,
        descricao: 'Terceiro - 14:00 as 22:20'
    },
];
//# sourceMappingURL=turnoTypes.js.map