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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
var pedido_entity_1 = require("../entities/pedido.entity");
var data_source_1 = require("../data-source");
var producaoMalharia_entity_1 = require("../entities/producaoMalharia.entity");
var perdaMalharia_entity_1 = require("../entities/perdaMalharia.entity");
var programacaoDublagem_entity_1 = require("../entities/programacaoDublagem.entity");
var OutController = /** @class */ (function () {
    function OutController() {
    }
    OutController.prototype.gerenciadorPedidosEmAberto = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sql;
            return __generator(this, function (_a) {
                sql = "\n    SELECT\n      p.idPedido,\n      p.dataPedido,\n      p.statusPedido,\n      pc.nome AS nomeCliente,\n      pv.nome AS nomeVendedor,\n        JSON_ARRAYAGG(\n    JSON_OBJECT(\n      'idPedido', p.idPedido,\n      'idDetalhePedido', dp.idDetalhePedido,\n      'Produto', pp.nome,\n      'qtd', dp.qtdPedida,\n      'vrUnitario', dp.vrUnitario,\n      'total', dp.qtdPedida * dp.vrUnitario,\n      'status', dp.statusItem\n    )\n  ) AS details\n    FROM \n      pedidos p\n    INNER JOIN\n      pessoas pc ON pc.idPessoa = p.idPessoa_cliente\n    INNER JOIN\n      pessoas pv ON pv.idPessoa = p.idPessoa_vendedor\n    INNER JOIN\n      detalhepedidos dp ON dp.idPedido = p.idPedido\n    INNER JOIN\n      produtos pp ON pp.idProduto = dp.idProduto\n    GROUP BY p.idPedido, p.dataPedido, p.idPrazoEntrega, pc.nome, pv.nome, p.statusPedido;  \n  ";
                return [2 /*return*/, data_source_1.AppDataSource.getRepository(pedido_entity_1.default).query(sql)];
            });
        });
    };
    OutController.prototype.pedidosEmAberto = function (itemPesquisa, campo) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, params;
            return __generator(this, function (_a) {
                sql = "\n    SELECT\n      p.*,\n      pc.nome AS nomeCliente,\n      pv.nome AS nomeVendedor\n    FROM \n      pedidos p\n    INNER JOIN\n      pessoas pc ON pc.idPessoa = p.idPessoa_cliente\n    INNER JOIN\n      pessoas pv ON pv.idPessoa = p.idPessoa_vendedor\n    WHERE \n      statusPedido = 'A' AND\n      ".concat(campo === 'data' ? 'dataPedido = ?' : 'pc.nome LIKE ?', "\n  ");
                params = [campo === 'data' ? itemPesquisa : "%".concat(itemPesquisa, "%")];
                return [2 /*return*/, data_source_1.AppDataSource.getRepository(pedido_entity_1.default).query(sql, params)];
            });
        });
    };
    OutController.prototype.limpaPecas = function (tinturaria) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, params;
            return __generator(this, function (_a) {
                sql = "\n    UPDATE\n      producaomalharias pm\n    SET\n      pm.idTinturaria = null,\n      pm.fechado = 0,\n      pm.dataFechado = null\n    WHERE\n      pm.idTinturaria = ?;\n  ";
                params = [tinturaria];
                return [2 /*return*/, data_source_1.AppDataSource.getRepository(producaoMalharia_entity_1.default).query(sql, params)];
            });
        });
    };
    OutController.prototype.produzirPedidos = function (pedidos, tipoProducao) {
        return __awaiter(this, void 0, void 0, function () {
            var ped, sql, params;
            return __generator(this, function (_a) {
                ped = '(' + pedidos.map(function (v) { return v; }).join(", ") + ')';
                sql = "\n    UPDATE\n      pedidos p\n    JOIN detalhepedidos dp on dp.idPedido = p.idPedido \n    SET\n      p.statusPedido = '".concat(tipoProducao, "',\n      dp.statusItem = '").concat(tipoProducao === 'C' ? 3 : 1, "'\n    WHERE\n      p.idPedido IN ").concat(ped, ";\n  ");
                params = [ped, tipoProducao];
                return [2 /*return*/, data_source_1.AppDataSource.getRepository(pedido_entity_1.default).query(sql, params)];
            });
        });
    };
    OutController.prototype.graficos = function (dtInicial, dtFinal, grupo) {
        return __awaiter(this, void 0, void 0, function () {
            var repository, repositoryPerda, sqlPerda, select, sql;
            return __generator(this, function (_a) {
                repository = data_source_1.AppDataSource.getRepository(producaoMalharia_entity_1.default);
                repositoryPerda = data_source_1.AppDataSource.getRepository(perdaMalharia_entity_1.default);
                if (grupo === 'perda') {
                    sqlPerda = "\n        SELECT\n          ROUND(SUM(qtd),2) AS pesoTotal,\n          COUNT(qtd) AS qtdTotal,\n          pt.nome AS tecelao\n        FROM\n          perdasmalharia pm\n        INNER JOIN\n          pessoas pt ON pt.idPessoa = pm.idPessoa_tecelao\n        INNER JOIN\n          produtos p ON p.idProduto = pm.idProduto\n        INNER JOIN\n          maquinas m ON m.idMaquina = pm.idMaquina\n        WHERE\n          pm.dataPerda BETWEEN ? AND ? \n        GROUP BY\n          pt.nome\n      ";
                    return [2 /*return*/, repositoryPerda.query(sqlPerda, [dtInicial, dtFinal])];
                }
                if (grupo === 'mes') {
                    select = 'ROUND(SUM(peso),2) AS pesoTotal, MONTH(dataProducao) AS mes';
                }
                else if (grupo === 'tecelao') {
                    select = 'ROUND(SUM(peso),2) AS pesoTotal, pt.nome AS tecelao';
                }
                else if (grupo === 'produto') {
                    select = 'ROUND(SUM(peso),2) AS pesoTotal, p.nome AS produto';
                }
                else {
                    throw new Error('Grupo inválido'); // Tratamento de erro para grupo inválido
                }
                sql = "\n      SELECT\n        ".concat(select, "\n      FROM \n        producaomalharias pm\n      INNER JOIN\n        pessoas pt ON pt.idPessoa = pm.idPessoa_tecelao\n      INNER JOIN\n        produtos p ON p.idProduto = pm.idProduto\n      WHERE\n        pm.dataProducao BETWEEN ? AND ? \n      GROUP BY\n        ").concat(grupo, "\n    ");
                return [2 /*return*/, repository.query(sql, [dtInicial, dtFinal])];
            });
        });
    };
    OutController.prototype.programacaoPedidos = function (itemPesquisa) {
        return __awaiter(this, void 0, void 0, function () {
            var sql;
            return __generator(this, function (_a) {
                sql = "\n    SELECT \n      pd.idProgramacaoDublagem,\n      pd.dataProgramacao,\n      pd.qtdCola,\n      pd.qtdFilme,\n      SUM(dp.qtdPedida) AS metros\n    FROM \n      programacaodublagens pd\n    INNER JOIN\n      detalheprogramacaodublagens dpd ON dpd.idProgramacaoDublagem = pd.idProgramacaoDublagem\n    INNER JOIN \n      pedidos p ON p.idPedido = dpd.idPedido\n    INNER JOIN\n      detalhepedidos dp ON dp.idPedido = p.idPedido\n    WHERE\n      (pd.dataProgramacao = IFNULL(?, pd.dataProgramacao))\n    GROUP BY\n      pd.idProgramacaoDublagem,\n      pd.dataProgramacao,\n      pd.qtdCola,\n      pd.qtdFilme;\n      ";
                return [2 /*return*/, data_source_1.AppDataSource.getRepository(programacaoDublagem_entity_1.default).query(sql, [itemPesquisa || null])];
            });
        });
    };
    __decorate([
        (0, common_1.Post)("gerenciadorPedidosEmAberto"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], OutController.prototype, "gerenciadorPedidosEmAberto", null);
    __decorate([
        (0, common_1.Post)("pedidosEmAberto"),
        __param(0, (0, common_1.Body)("itemPesquisa")),
        __param(1, (0, common_1.Body)("campo")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String]),
        __metadata("design:returntype", Promise)
    ], OutController.prototype, "pedidosEmAberto", null);
    __decorate([
        (0, common_1.Post)("limpaPecas"),
        __param(0, (0, common_1.Body)("tinturaria")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Number]),
        __metadata("design:returntype", Promise)
    ], OutController.prototype, "limpaPecas", null);
    __decorate([
        (0, common_1.Post)("produzirPedidos"),
        __param(0, (0, common_1.Body)("pedidos")),
        __param(1, (0, common_1.Body)("tipoProducao")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array, String]),
        __metadata("design:returntype", Promise)
    ], OutController.prototype, "produzirPedidos", null);
    __decorate([
        (0, common_1.Post)("graficos"),
        __param(0, (0, common_1.Body)("dtInicial")),
        __param(1, (0, common_1.Body)("dtFinal")),
        __param(2, (0, common_1.Body)("grupo")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, String]),
        __metadata("design:returntype", Promise)
    ], OutController.prototype, "graficos", null);
    __decorate([
        (0, common_1.Post)("programacaoPedidos"),
        __param(0, (0, common_1.Body)("itemPesquisa")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], OutController.prototype, "programacaoPedidos", null);
    OutController = __decorate([
        (0, common_1.Controller)()
    ], OutController);
    return OutController;
}());
exports.OutController = OutController;
//# sourceMappingURL=out.controller.js.map