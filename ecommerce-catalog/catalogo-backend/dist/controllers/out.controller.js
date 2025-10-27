"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutController = void 0;
var common_1 = require("@nestjs/common");
var data_source_1 = require("../data-source");
var typeorm_1 = require("typeorm");
var pedido_1 = require("../entity/pedido");
var cliente_1 = require("../entity/cliente");
var detalhePedido_1 = require("../entity/detalhePedido");
var produto_1 = require("../entity/produto");
var OutController = /** @class */ (function () {
    function OutController() {
    }
    OutController.prototype.dashboard = function (idUsuario) {
        return __awaiter(this, void 0, void 0, function () {
            var idVendedor, pedidoRepository, clienteRepository, agora, mesAtual, anoAtual, toMySQL, inicioMesAtual, fimMesAtual, inicioMesPassado, fimMesPassado, pedidosAtual, pedidosPassado, clientesAtivosAtual, clientesAtivosPassado, nomesMeses, receitasUltimos6Meses, i, mes, inicioMes, fimMes, pedidosMes, vendas, pedidos, diaSemana, diffSegunda, inicioSemana, fimSemana, pedidosSemana, diasSemana, receitaSemana, _i, pedidosSemana_1, pedido, dataPedido, dia, receitaAtual, receitaPassada, qtdAtual, qtdPassada, clientesAtual, clientesPassado, ticketAtual, ticketPassado, calcPercentual, comparativo, retorno;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!idUsuario)
                            throw new Error("Usuário inválido.");
                        idVendedor = idUsuario;
                        pedidoRepository = data_source_1.AppDataSource.getRepository(pedido_1.default);
                        clienteRepository = data_source_1.AppDataSource.getRepository(cliente_1.default);
                        agora = new Date();
                        mesAtual = agora.getMonth() // 0–11
                        ;
                        anoAtual = agora.getFullYear();
                        toMySQL = function (date) { return date.toISOString().slice(0, 19).replace("T", " "); };
                        inicioMesAtual = toMySQL(new Date(anoAtual, mesAtual, 1));
                        fimMesAtual = toMySQL(new Date(anoAtual, mesAtual + 1, 1));
                        inicioMesPassado = toMySQL(new Date(mesAtual === 0 ? anoAtual - 1 : anoAtual, mesAtual === 0 ? 11 : mesAtual - 1, 1));
                        fimMesPassado = toMySQL(new Date(anoAtual, mesAtual, 1));
                        return [4 /*yield*/, pedidoRepository.find({
                                where: { status: 6, data: (0, typeorm_1.Between)(inicioMesAtual, fimMesAtual), idVendedor: idVendedor }
                            })];
                    case 1:
                        pedidosAtual = _a.sent();
                        return [4 /*yield*/, pedidoRepository.find({
                                where: { status: 6, data: (0, typeorm_1.Between)(inicioMesPassado, fimMesPassado), idVendedor: idVendedor }
                            })];
                    case 2:
                        pedidosPassado = _a.sent();
                        return [4 /*yield*/, clienteRepository.find({
                                where: { ativo: true, dataCadastro: (0, typeorm_1.Between)(inicioMesAtual, fimMesAtual), idVendedor: idVendedor }
                            })];
                    case 3:
                        clientesAtivosAtual = _a.sent();
                        return [4 /*yield*/, clienteRepository.find({
                                where: { ativo: true, dataCadastro: (0, typeorm_1.Between)(inicioMesPassado, fimMesPassado), idVendedor: idVendedor }
                            })
                            // === ÚLTIMOS 6 MESES ===
                        ];
                    case 4:
                        clientesAtivosPassado = _a.sent();
                        nomesMeses = [
                            "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
                            "Jul", "Ago", "Set", "Out", "Nov", "Dez"
                        ];
                        receitasUltimos6Meses = [];
                        i = 5;
                        _a.label = 5;
                    case 5:
                        if (!(i >= 0)) return [3 /*break*/, 8];
                        mes = mesAtual - i;
                        if (mes < 0)
                            return [3 /*break*/, 7];
                        inicioMes = toMySQL(new Date(anoAtual, mes, 1));
                        fimMes = toMySQL(new Date(anoAtual, mes + 1, 1));
                        return [4 /*yield*/, pedidoRepository.find({
                                where: { status: 6, data: (0, typeorm_1.Between)(inicioMes, fimMes), idVendedor: idVendedor }
                            })];
                    case 6:
                        pedidosMes = _a.sent();
                        vendas = pedidosMes.reduce(function (soma, p) { return soma + Number(p.totalDescontado || 0); }, 0);
                        pedidos = pedidosMes.length;
                        receitasUltimos6Meses.push({
                            month: nomesMeses[mes],
                            pedidos: pedidos,
                            vendas: vendas,
                        });
                        _a.label = 7;
                    case 7:
                        i--;
                        return [3 /*break*/, 5];
                    case 8:
                        diaSemana = agora.getDay() // 0=domingo
                        ;
                        diffSegunda = diaSemana === 0 ? -6 : 1 - diaSemana;
                        inicioSemana = toMySQL(new Date(anoAtual, mesAtual, agora.getDate() + diffSegunda));
                        fimSemana = toMySQL(new Date(anoAtual, mesAtual, agora.getDate() + (7 - diaSemana)));
                        return [4 /*yield*/, pedidoRepository.find({
                                where: { status: 6, data: (0, typeorm_1.Between)(inicioSemana, fimSemana), idVendedor: idVendedor }
                            })];
                    case 9:
                        pedidosSemana = _a.sent();
                        diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
                        receitaSemana = diasSemana.map(function (dia) { return ({
                            day: dia,
                            vendas: 0,
                        }); });
                        for (_i = 0, pedidosSemana_1 = pedidosSemana; _i < pedidosSemana_1.length; _i++) {
                            pedido = pedidosSemana_1[_i];
                            dataPedido = new Date(pedido.data);
                            dia = dataPedido.getDay();
                            receitaSemana[dia].vendas += Number(pedido.totalDescontado || 0);
                        }
                        receitaAtual = pedidosAtual.reduce(function (soma, p) { return soma + Number(p.totalDescontado || 0); }, 0);
                        receitaPassada = pedidosPassado.reduce(function (soma, p) { return soma + Number(p.totalDescontado || 0); }, 0);
                        qtdAtual = pedidosAtual.length;
                        qtdPassada = pedidosPassado.length;
                        clientesAtual = clientesAtivosAtual.length;
                        clientesPassado = clientesAtivosPassado.length;
                        ticketAtual = qtdAtual > 0 ? receitaAtual / qtdAtual : 0;
                        ticketPassado = qtdPassada > 0 ? receitaPassada / qtdPassada : 0;
                        calcPercentual = function (atual, anterior) {
                            if (anterior === 0 && atual === 0)
                                return 0;
                            if (anterior === 0)
                                return 100;
                            return Number((((atual - anterior) / anterior) * 100).toFixed(2));
                        };
                        comparativo = {
                            percentualReceita: calcPercentual(receitaAtual, receitaPassada),
                            percentualPedidos: calcPercentual(qtdAtual, qtdPassada),
                            percentualTicket: calcPercentual(ticketAtual, ticketPassado),
                            percentualClientes: calcPercentual(clientesAtual, clientesPassado),
                        };
                        retorno = {
                            receitaAtual: receitaAtual,
                            qtdAtual: qtdAtual,
                            ticketAtual: ticketAtual,
                            clientesAtual: clientesAtual,
                            receitasUltimos6Meses: receitasUltimos6Meses,
                            receitaSemana: receitaSemana,
                            receitaComparativo: comparativo,
                        };
                        return [2 /*return*/, retorno];
                }
            });
        });
    };
    OutController.prototype.maisVendidos = function (idUsuario) {
        return __awaiter(this, void 0, void 0, function () {
            var pedidoRepository, detalhePedidoRepository, produtoRepository, pedidosAtual, idVendedor, detalhesAtual, produtosMaisVendidos, _loop_1, _i, detalhesAtual_1, detalhe, produtos;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pedidoRepository = data_source_1.AppDataSource.getRepository(pedido_1.default);
                        detalhePedidoRepository = data_source_1.AppDataSource.getRepository(detalhePedido_1.default);
                        produtoRepository = data_source_1.AppDataSource.getRepository(produto_1.default);
                        if (!(idUsuario === undefined)) return [3 /*break*/, 2];
                        return [4 /*yield*/, pedidoRepository.find({
                                where: { status: 6 }
                            })];
                    case 1:
                        pedidosAtual = _a.sent();
                        return [3 /*break*/, 4];
                    case 2:
                        idVendedor = idUsuario;
                        return [4 /*yield*/, pedidoRepository.find({
                                where: { status: 6, idVendedor: idVendedor }
                            })];
                    case 3:
                        pedidosAtual = _a.sent();
                        _a.label = 4;
                    case 4: return [4 /*yield*/, detalhePedidoRepository.find({
                            where: { idPedido: (0, typeorm_1.In)(pedidosAtual.map(function (p) { return p.id; })) }
                        })
                        // === Cálculos ===
                    ];
                    case 5:
                        detalhesAtual = _a.sent();
                        produtosMaisVendidos = [];
                        _loop_1 = function (detalhe) {
                            var produto = produtosMaisVendidos.find(function (p) { return p.idProduto === detalhe.idProduto; });
                            if (produto) {
                                produto.quantidade += detalhe.quantidade;
                            }
                            else {
                                produtosMaisVendidos.push({ idProduto: detalhe.idProduto, quantidade: detalhe.quantidade });
                            }
                        };
                        for (_i = 0, detalhesAtual_1 = detalhesAtual; _i < detalhesAtual_1.length; _i++) {
                            detalhe = detalhesAtual_1[_i];
                            _loop_1(detalhe);
                        }
                        return [4 /*yield*/, produtoRepository.find({
                                where: { id: (0, typeorm_1.In)(produtosMaisVendidos.map(function (p) { return p.idProduto; })) }
                            })];
                    case 6:
                        produtos = _a.sent();
                        produtos.map(function (p) {
                            var produtoMaisVendido = produtosMaisVendidos.find(function (pmv) { return pmv.idProduto === p.id; });
                            if (produtoMaisVendido) {
                                p.maisVendido = produtoMaisVendido.quantidade;
                            }
                        });
                        produtoRepository.save(produtos);
                        return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        (0, common_1.Post)("dashboard"),
        __param(0, (0, common_1.Body)("idUsuario")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], OutController.prototype, "dashboard", null);
    __decorate([
        (0, common_1.Post)("maisVendidos"),
        __param(0, (0, common_1.Body)("idUsuario")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], OutController.prototype, "maisVendidos", null);
    OutController = __decorate([
        (0, common_1.Controller)()
    ], OutController);
    return OutController;
}());
exports.OutController = OutController;
//# sourceMappingURL=out.controller.js.map