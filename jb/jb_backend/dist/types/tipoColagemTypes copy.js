"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TipoColagemTypes = exports.TipoColagemType = void 0;
var TipoColagemType;
(function (TipoColagemType) {
    TipoColagemType[TipoColagemType["cola"] = 0] = "cola";
    TipoColagemType[TipoColagemType["filme"] = 1] = "filme";
    TipoColagemType[TipoColagemType["smell"] = 2] = "smell";
    TipoColagemType[TipoColagemType["fogo"] = 3] = "fogo";
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
//# sourceMappingURL=tipoColagemTypes%20copy.js.map