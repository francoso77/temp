"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TipoColagemTypes = exports.TipoColagemType = void 0;
var TipoColagemType;
(function (TipoColagemType) {
    TipoColagemType[TipoColagemType["cola"] = 1] = "cola";
    TipoColagemType[TipoColagemType["filme"] = 2] = "filme";
    TipoColagemType[TipoColagemType["smell"] = 3] = "smell";
    TipoColagemType[TipoColagemType["fogo"] = 4] = "fogo";
})(TipoColagemType || (exports.TipoColagemType = TipoColagemType = {}));
exports.TipoColagemTypes = [
    {
        idTipoColagem: TipoColagemType.cola,
        descricao: "Cola"
    },
    {
        idTipoColagem: TipoColagemType.filme,
        descricao: "Filme"
    },
    {
        idTipoColagem: TipoColagemType.fogo,
        descricao: "Fogo"
    },
    {
        idTipoColagem: TipoColagemType.smell,
        descricao: "Smell"
    },
];
//# sourceMappingURL=tipoColagemTypes.js.map