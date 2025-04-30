"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraficoTypes = exports.GraficoType = void 0;
var GraficoType;
(function (GraficoType) {
    GraficoType["mes"] = "mes";
    GraficoType["produto"] = "produto";
    GraficoType["tecelao"] = "tecelao";
    GraficoType["perda"] = "perda";
})(GraficoType || (exports.GraficoType = GraficoType = {}));
exports.GraficoTypes = [
    {
        idGraficoType: GraficoType.mes,
        descricao: 'Gráfico por Mensal'
    },
    {
        idGraficoType: GraficoType.produto,
        descricao: 'Gráfico por Produto'
    },
    {
        idGraficoType: GraficoType.tecelao,
        descricao: 'Gráfico por Tecelão'
    },
    {
        idGraficoType: GraficoType.perda,
        descricao: 'Gráfico por Perda'
    },
];
//# sourceMappingURL=graficoTypes.js.map