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
var producaoDublagem_entity_1 = require("../entities/producaoDublagem.entity");
var tinturaria_entity_1 = require("../entities/tinturaria.entity");
var estoque_entity_1 = require("../entities/estoque.entity");
var programacao_entity_1 = require("../entities/programacao.entity");
var OutController = /** @class */ (function () {
    function OutController() {
    }
    OutController.prototype.produtosEmEstoque = function (idProduto, idCor, tipoProduto, idFornecedor, operador, qtdComparar) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, params;
            return __generator(this, function (_a) {
                sql = "\n    SELECT \n\t    e.idProduto,\n\t    e.idCor,\n\t    p.tipoProduto,\n\t    e.idPessoa_fornecedor,\n\t    ROUND(SUM(e.qtd),2) AS totalQtd\n    FROM estoques e\n    INNER JOIN produtos p ON p.idProduto = e.idProduto\n    LEFT JOIN cores c ON c.idCor = e.idCor\n    INNER JOIN pessoas pf ON pf.idPessoa = e.idPessoa_fornecedor\n    WHERE\n      (? IS NULL OR e.idProduto = ?) AND\n      (? IS NULL OR e.idCor = ?) AND\n      (? IS NULL OR p.tipoProduto = ?) AND\n      (? IS NULL OR e.idPessoa_fornecedor = ?)\n    GROUP BY\n\t    e.idProduto,\n\t    e.idCor,\n\t    e.idPessoa_fornecedor\n    HAVING\n      (? IS NULL OR ROUND(SUM(e.qtd),2) ".concat(operador, " ?)\n    ORDER BY\n      e.idProduto ASC\n    ;\n    ");
                params = [idProduto, idProduto, idCor, idCor, tipoProduto, tipoProduto, idFornecedor, idFornecedor, qtdComparar, qtdComparar, operador];
                return [2 /*return*/, data_source_1.AppDataSource.getRepository(estoque_entity_1.default).query(sql, params)];
            });
        });
    };
    OutController.prototype.programacaoTinturaria = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, params;
            return __generator(this, function (_a) {
                sql = "\n      SELECT \n          prg.idProgramacao,\n          prg.notaFiscal,\n          prg.dataProgramacao,\n          prg.msg,\n          tin.idTinturaria AS romaneio,\n          pc.nome AS cliente,\n          pf.nome AS tinturaria,\n          JSON_ARRAYAGG(\n              JSON_OBJECT(\n                  'produto', pro.nome,\n                  'cor', c.nome,\n                  'peso', ROUND(det.peso, 2),\n                  'largura', ROUND(det.largura,2),\n                  'gm2', ROUND(det.gm2,2 ),\n                  'qtdPecas', ROUND(det.qtdPeca,0)\n              )\n          ) AS pecas\n      FROM \n          programacoes prg\n      INNER JOIN \n          tinturarias tin ON tin.idTinturaria = prg.idTinturaria\n      INNER JOIN \n          pessoas pc ON pc.idPessoa = prg.idPessoa_cliente\n      INNER JOIN \n          pessoas pf ON pf.idPessoa = tin.idPessoa_fornecedor\n      INNER JOIN \n          detalheprogramacoes det ON det.idProgramacao = prg.idProgramacao\n      INNER JOIN \n          produtos pro ON pro.idProduto = det.idProduto\n      INNER JOIN \n          cores c ON c.idCor = det.idCor\n      WHERE \n          prg.idProgramacao = ?\n      GROUP BY \n          prg.idProgramacao, prg.notaFiscal, prg.dataProgramacao, prg.msg, tin.idTinturaria\n      ORDER BY \n          MIN(pro.nome) ASC;\n    ";
                params = [id];
                return [2 /*return*/, data_source_1.AppDataSource.getRepository(programacao_entity_1.default).query(sql, params)];
            });
        });
    };
    OutController.prototype.pedidosFechados = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, params;
            return __generator(this, function (_a) {
                sql = "\n      SELECT \n        pd.idProgramacaoDublagem AS idProgramacaoDublagem,\n        ped.idPedido AS idPedido,\n        ped.dataPedido as dataPedido,\n        ped.statusPedido AS statusPedido,\n        pc.idPessoa AS idPessoa_cliente,\n        pv.idPessoa AS idPessoa_vendedor\n      FROM\n        programacaodublagens pd\n      INNER JOIN\n        detalheprogramacaodublagens dpd ON dpd.idProgramacaoDublagem = pd.idProgramacaoDublagem\n      INNER JOIN\n        pedidos ped ON ped.idPedido = dpd.idPedido\n      INNER JOIN\n        detalhepedidos dp ON dp.idPedido = ped.idPedido\n      INNER JOIN\n        pessoas pc ON pc.idPessoa = ped.idPessoa_cliente\n      INNER JOIN\n        pessoas pv ON pv.idPessoa = ped.idPessoa_vendedor\n      WHERE \n        ped.statusPedido = 'F' AND\n        pd.idProgramacaoDublagem = ?\n      ORDER BY\n        ped.dataPedido ASC\n;\n    ";
                params = [id];
                return [2 /*return*/, data_source_1.AppDataSource.getRepository(pedido_entity_1.default).query(sql, params)];
            });
        });
    };
    OutController.prototype.etiquetasPedidos = function (pedidos) {
        return __awaiter(this, void 0, void 0, function () {
            var ped, sql, params;
            return __generator(this, function (_a) {
                ped = '(' + pedidos.map(function (v) { return v; }).join(", ") + ')';
                sql = "\n      SELECT \n        pd.dataProducao AS dataProducao,\n        ped.idPedido AS pedido,\n        pc.idPessoa AS idCliente,\n        pc.nome AS cliente,\n        pro.idProduto AS idProduto,\n        pro.nome AS produto,\n        dp.metros AS metros\n      FROM\n        producaodublagens pd\n      INNER JOIN\n        detalheproducaodublagens dpd ON dpd.idDublagem = pd.idDublagem\n      INNER JOIN\n        detalhepecas dp ON dp.idDetalheProducaoDublagem = dpd.idDetalheProducaoDublagem\n      INNER JOIN\n        produtos pro ON pro.idProduto = dpd.idProduto\n      INNER JOIN\n        pedidos ped ON ped.idPedido = pd.idPedido\n      INNER JOIN\n        pessoas pc ON pc.idPessoa = ped.idPessoa_cliente\n      WHERE \n        ped.idPedido IN ".concat(ped, "\n      GROUP BY\n        pd.dataProducao, pedido, idCliente, cliente, idProduto, produto, metros\n      order by\n        pedido, produto ASC\n    ");
                params = [ped];
                return [2 /*return*/, data_source_1.AppDataSource.getRepository(producaoDublagem_entity_1.default).query(sql, params)];
            });
        });
    };
    OutController.prototype.fichasCortesPedidos = function (itemPesquisa) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, params;
            return __generator(this, function (_a) {
                sql = "\n      SELECT \n        pd.dataProgramacao,\n        p.idPedido AS pedido,\n        pe.nome AS cliente,\n        pro.nome AS produto,\n        dp.qtdPedida AS metros\n      FROM\n        programacaodublagens pd\n      INNER JOIN\n        detalheprogramacaodublagens dpd ON dpd.idProgramacaoDublagem = pd.idProgramacaoDublagem\n      INNER JOIN\n        pedidos p ON p.idPedido = dpd.idPedido\n      INNER JOIN\n        detalhepedidos dp ON dp.idPedido = p.idPedido\n      INNER JOIN\n        produtos pro ON pro.idProduto = dp.idProduto\n      INNER JOIN\n        pessoas pe ON pe.idPessoa = p.idPessoa_cliente\n      WHERE \n        dp.statusItem = 3 AND\n        pd.dataProgramacao = ?\n        ;\n\n    ";
                params = [itemPesquisa];
                return [2 /*return*/, data_source_1.AppDataSource.getRepository(programacaoDublagem_entity_1.default).query(sql, params)];
            });
        });
    };
    OutController.prototype.gerenciadorPedidosEmAberto = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sql;
            return __generator(this, function (_a) {
                sql = "\n    SELECT\n      p.idPedido,\n      p.dataPedido,\n      p.statusPedido,\n      pc.nome AS nomeCliente,\n      pv.nome AS nomeVendedor,\n        JSON_ARRAYAGG(\n    JSON_OBJECT(\n      'idPedido', p.idPedido,\n      'idDetalhePedido', dp.idDetalhePedido,\n      'Produto', pp.nome,\n      'qtd', dp.qtdPedida,\n      'vrUnitario', dp.vrUnitario,\n      'total', dp.qtdPedida * dp.vrUnitario,\n      'status', dp.statusItem\n    )\n  ) AS details\n    FROM \n      pedidos p\n    INNER JOIN\n      pessoas pc ON pc.idPessoa = p.idPessoa_cliente\n    INNER JOIN\n      pessoas pv ON pv.idPessoa = p.idPessoa_vendedor\n    INNER JOIN\n      detalhepedidos dp ON dp.idPedido = p.idPedido\n    INNER JOIN\n      produtos pp ON pp.idProduto = dp.idProduto\n    GROUP BY p.idPedido, p.dataPedido, p.idPrazoEntrega, pc.nome, pv.nome, p.statusPedido\n    ORDER BY p.dataPedido DESC\n    ;  \n  ";
                return [2 /*return*/, data_source_1.AppDataSource.getRepository(pedido_entity_1.default).query(sql)];
            });
        });
    };
    OutController.prototype.corteProducaoDublagem = function (itemPesquisa, campo) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, params;
            return __generator(this, function (_a) {
                sql = "\n      SELECT \n        pd.dataProducao AS dataProducao,\n        pd.idPedido AS pedido,\n        pc.nome AS cliente,\n        ped.statusPedido AS statusPedido,\n        SUM(dped.qtdPedida) AS metrosPedido,\n        SUM(dpd.metrosTotal) AS metros\n        \n      FROM \n        producaodublagens pd\n      INNER JOIN\n        detalheproducaodublagens dpd ON dpd.idDublagem = pd.idDublagem\n      INNER JOIN\n        produtos p ON p.idProduto = dpd.idProduto\n      INNER JOIN \n        pedidos ped ON ped.idPedido = pd.idPedido\n      INNER JOIN\n        detalhepedidos dped ON dped.idPedido = ped.idPedido\n      INNER JOIN\n        pessoas pc ON pc.idPessoa = ped.idPessoa_cliente\n      WHERE\n        ".concat(campo === 'data' ? 'pd.dataProducao = ?' : 'pc.nome LIKE ?', "\n      GROUP BY\n        dataProducao, pedido, cliente, statusPedido\n      ORDER BY\n        dataProducao, pedido, cliente\n  ");
                params = [campo === 'data' ? itemPesquisa : "%".concat(itemPesquisa, "%")];
                return [2 /*return*/, data_source_1.AppDataSource.getRepository(producaoDublagem_entity_1.default).query(sql, params)];
            });
        });
    };
    OutController.prototype.pedidosEmProducao = function (itemPesquisa, campo) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, params;
            return __generator(this, function (_a) {
                sql = "\n    SELECT\n      p.*,\n      pc.nome AS nomeCliente,\n      pv.nome AS nomeVendedor\n    FROM \n      pedidos p\n    INNER JOIN\n      pessoas pc ON pc.idPessoa = p.idPessoa_cliente\n    INNER JOIN\n      pessoas pv ON pv.idPessoa = p.idPessoa_vendedor\n    WHERE \n      statusPedido = 'C' AND\n      ".concat(campo === 'data' ? 'dataPedido = ?' : 'pc.nome LIKE ?', "\n  ");
                params = [campo === 'data' ? itemPesquisa : "%".concat(itemPesquisa, "%")];
                return [2 /*return*/, data_source_1.AppDataSource.getRepository(pedido_entity_1.default).query(sql, params)];
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
    OutController.prototype.pedidosEspumasEForrosProgramadas = function (itemPesquisa, tipo) {
        return __awaiter(this, void 0, void 0, function () {
            var tipos, tp, sql, params;
            return __generator(this, function (_a) {
                tipos = [2, 6];
                tp = 0;
                if (tipo === 'Espuma') {
                    tp = 2;
                }
                else if (tipo === 'Forro') {
                    tp = 6;
                }
                else {
                    tp = '(' + tipos.map(function (v) { return v; }).join(", ") + ')';
                }
                sql = "\n      SELECT \n        pro2.idProduto AS idProduto,\n        SUM(dp.qtdPedida * de.qtd) AS qtdTotal,\n        pro2.nome AS materiaPrima,\n        c.idCor AS idCor,\n        c.nome AS cor\n      FROM\n        pedidos p\n      INNER JOIN \n        detalhepedidos dp ON dp.idPedido = p.idPedido\n      INNER JOIN\n        produtos pro1 ON pro1.idProduto = dp.idProduto\n      INNER JOIN\n        estruturas e ON e.idProduto = dp.idProduto\n      INNER JOIN\n        detalheestruturas de ON de.idEstrutura = e.idEstrutura\n      INNER JOIN\n        produtos pro2 ON pro2.idProduto = de.idProduto\n      INNER JOIN \n        cores c ON c.idCor = de.idCor\n      INNER JOIN\n        pessoas pc ON pc.idPessoa = p.idPessoa_cliente\n      INNER JOIN \n        detalheprogramacaodublagens dpd ON dpd.idPedido = p.idPedido\n      INNER JOIN \n        programacaodublagens pd ON pd.idProgramacaoDublagem = dpd.idProgramacaoDublagem\n\n      WHERE \n        pro2.tipoProduto IN (?) AND\n        dp.statusItem = 3 AND\n        pd.dataProgramacao = ?\n      GROUP BY\n        idProduto, materiaPrima, idCor, cor\n      ORDER BY\n        materiaPrima, cor\n        ;\n      ";
                params = [tp, itemPesquisa];
                return [2 /*return*/, data_source_1.AppDataSource.getRepository(pedido_entity_1.default).query(sql, params)];
            });
        });
    };
    OutController.prototype.pedidosTecidosProgramadas = function (itemPesquisa) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, params;
            return __generator(this, function (_a) {
                sql = "\n      SELECT \n      pro2.idProduto AS idProduto,\n     \tp.idPedido AS idPedido,\n      pc.nome AS cliente,\n      pro2.nome AS produto,\n      pro2.tipoProduto AS tipoProduto,\n      c.nome AS cor,\n      c.nivel AS corNivel,\n      (de.qtd * dp.qtdPedida) AS metros\n      FROM\n        pedidos p\n      INNER JOIN \n        detalhepedidos dp ON dp.idPedido = p.idPedido\n      INNER JOIN\n        produtos pro1 ON pro1.idProduto = dp.idProduto\n      INNER JOIN\n        estruturas e ON e.idProduto = dp.idProduto\n      INNER JOIN\n        detalheestruturas de ON de.idEstrutura = e.idEstrutura\n      INNER JOIN\n        produtos pro2 ON pro2.idProduto = de.idProduto\n      INNER JOIN \n        cores c ON c.idCor = de.idCor\n      INNER JOIN\n        pessoas pc ON pc.idPessoa = p.idPessoa_cliente\n      INNER JOIN \n        detalheprogramacaodublagens dpd ON dpd.idPedido = p.idPedido\n      INNER JOIN \n        programacaodublagens pd ON pd.idProgramacaoDublagem = dpd.idProgramacaoDublagem\n      WHERE \n        pro2.tipoProduto IN(2,10) AND\n        dp.statusItem = 3 AND\n        pd.dataProgramacao = ?\n      ORDER BY\n        produto, corNivel\n        ;       \n      ";
                params = [itemPesquisa];
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
    OutController.prototype.atualizarStatusPedido = function (pedido, tipoStatus, produto, qtd) {
        return __awaiter(this, void 0, void 0, function () {
            var novoStatusPedido, novoStatusItem, sql, params;
            return __generator(this, function (_a) {
                novoStatusPedido = 'F';
                novoStatusItem = 2;
                // console.log(tipoStatus)
                // console.log(pedido)
                // console.log(produto)
                // console.log(qtd)
                // console.log(novoStatusPedido)
                // console.log(novoStatusItem)
                if (tipoStatus === 'Excluir') {
                    novoStatusPedido = 'C';
                    novoStatusItem = 3;
                }
                sql = "\n      UPDATE \n          pedidos p\n      INNER JOIN \n          detalhepedidos dp ON dp.idPedido = p.idPedido\n      SET \n          p.statusPedido = ?,\n          dp.statusItem = ?,\n          dp.qtdAtendida = ?\n      WHERE \n          p.idPedido = ? \n          AND dp.idProduto = ?\n    ;\n\n  ";
                params = [novoStatusPedido, novoStatusItem, qtd, pedido, produto];
                return [2 /*return*/, data_source_1.AppDataSource.getRepository(pedido_entity_1.default).query(sql, params)];
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
    OutController.prototype.romaneiosTinturaria = function (pedidos) {
        return __awaiter(this, void 0, void 0, function () {
            var ped, sql, params;
            return __generator(this, function (_a) {
                ped = '(' + pedidos.map(function (v) { return v; }).join(", ") + ')';
                sql = "\n    SELECT \n        t.idTinturaria AS romaneio,\n        t.dataTinturaria AS dataTinturaria, \n        t.idPessoa_cliente AS idCliente,\n        pc.nome AS cliente,\n        t.idPessoa_fornecedor AS idFornecedor,\n        pf.nome AS tinturaria,\n        JSON_ARRAYAGG(\n            JSON_OBJECT(\n                'idTinturaria', dt.idTinturaria,\n                'idMalharia', pm.idMalharia,\n                'tear', m.nome,\n                'peca', pm.peca,      \n                'artigo', p.nome,\n                'peso', ROUND(pm.peso, 2),\n                'tecelao', pt.nome,\n                'revisador', pr.nome,\n                'composisao', (\n                    SELECT JSON_ARRAYAGG(\n                        JSON_OBJECT(\n                            'fio', pro.nome,\n                            'qtdFio', des.qtd\n                        )\n                    )\n                    FROM detalheestruturas des\n                    INNER JOIN produtos pro ON pro.idProduto = des.idProduto\n                    WHERE des.idEstrutura = e.idEstrutura\n                )\n            )\n        ) AS pecas\n    FROM\n        tinturarias t\n        INNER JOIN detalhetinturarias dt ON dt.idTinturaria = t.idTinturaria\n        INNER JOIN producaomalharias pm ON pm.idMalharia = dt.idMalharia\n        INNER JOIN pessoas pr ON pr.idPessoa = pm.idPessoa_revisador\n        INNER JOIN pessoas pt ON pt.idPessoa = pm.idPessoa_tecelao\n        INNER JOIN maquinas m ON m.idMaquina = pm.idMaquina\n        INNER JOIN pessoas pc ON pc.idPessoa = t.idPessoa_cliente\n        INNER JOIN pessoas pf ON pf.idPessoa = t.idPessoa_fornecedor\n        INNER JOIN produtos p ON p.idProduto = pm.idProduto\n        INNER JOIN estruturas e ON e.idProduto = p.idProduto\n    WHERE\n        t.idTinturaria IN ".concat(ped, "\n    GROUP BY\n        romaneio, dataTinturaria, idCliente, cliente, idFornecedor, tinturaria\n    ORDER BY\n        MIN(p.nome) ASC\n    ;\n      ");
                params = [ped];
                return [2 /*return*/, data_source_1.AppDataSource.getRepository(tinturaria_entity_1.default).query(sql, params)];
            });
        });
    };
    __decorate([
        (0, common_1.Post)("produtosEmEstoque"),
        __param(0, (0, common_1.Body)("idProduto")),
        __param(1, (0, common_1.Body)("idCor")),
        __param(2, (0, common_1.Body)("tipoProduto")),
        __param(3, (0, common_1.Body)("idFornecedor")),
        __param(4, (0, common_1.Body)("operador")),
        __param(5, (0, common_1.Body)("qtdComparar")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Number, Number, Number, Number, String, Number]),
        __metadata("design:returntype", Promise)
    ], OutController.prototype, "produtosEmEstoque", null);
    __decorate([
        (0, common_1.Post)("programacaoTinturaria"),
        __param(0, (0, common_1.Body)("id")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Number]),
        __metadata("design:returntype", Promise)
    ], OutController.prototype, "programacaoTinturaria", null);
    __decorate([
        (0, common_1.Post)("pedidosFechados"),
        __param(0, (0, common_1.Body)("id")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Number]),
        __metadata("design:returntype", Promise)
    ], OutController.prototype, "pedidosFechados", null);
    __decorate([
        (0, common_1.Post)("etiquetasPedidos"),
        __param(0, (0, common_1.Body)("pedidos")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", Promise)
    ], OutController.prototype, "etiquetasPedidos", null);
    __decorate([
        (0, common_1.Post)("fichasCortesPedidos"),
        __param(0, (0, common_1.Body)("itemPesquisa")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], OutController.prototype, "fichasCortesPedidos", null);
    __decorate([
        (0, common_1.Post)("gerenciadorPedidosEmAberto"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], OutController.prototype, "gerenciadorPedidosEmAberto", null);
    __decorate([
        (0, common_1.Post)("corteProducaoDublagem"),
        __param(0, (0, common_1.Body)("itemPesquisa")),
        __param(1, (0, common_1.Body)("campo")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String]),
        __metadata("design:returntype", Promise)
    ], OutController.prototype, "corteProducaoDublagem", null);
    __decorate([
        (0, common_1.Post)("pedidosEmProducao"),
        __param(0, (0, common_1.Body)("itemPesquisa")),
        __param(1, (0, common_1.Body)("campo")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String]),
        __metadata("design:returntype", Promise)
    ], OutController.prototype, "pedidosEmProducao", null);
    __decorate([
        (0, common_1.Post)("pedidosEmAberto"),
        __param(0, (0, common_1.Body)("itemPesquisa")),
        __param(1, (0, common_1.Body)("campo")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String]),
        __metadata("design:returntype", Promise)
    ], OutController.prototype, "pedidosEmAberto", null);
    __decorate([
        (0, common_1.Post)("pedidosEspumasEForrosProgramadas"),
        __param(0, (0, common_1.Body)("itemPesquisa")),
        __param(1, (0, common_1.Body)("tipo")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String]),
        __metadata("design:returntype", Promise)
    ], OutController.prototype, "pedidosEspumasEForrosProgramadas", null);
    __decorate([
        (0, common_1.Post)("pedidosTecidosProgramadas"),
        __param(0, (0, common_1.Body)("itemPesquisa")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], OutController.prototype, "pedidosTecidosProgramadas", null);
    __decorate([
        (0, common_1.Post)("limpaPecas"),
        __param(0, (0, common_1.Body)("tinturaria")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Number]),
        __metadata("design:returntype", Promise)
    ], OutController.prototype, "limpaPecas", null);
    __decorate([
        (0, common_1.Post)("atualizarStatusPedido"),
        __param(0, (0, common_1.Body)("pedido")),
        __param(1, (0, common_1.Body)("tipoStatus")),
        __param(2, (0, common_1.Body)('produto')),
        __param(3, (0, common_1.Body)('qtd')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Number, String, Number, Number]),
        __metadata("design:returntype", Promise)
    ], OutController.prototype, "atualizarStatusPedido", null);
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
    __decorate([
        (0, common_1.Post)("romaneiosTinturaria"),
        __param(0, (0, common_1.Body)("pedidos")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", Promise)
    ], OutController.prototype, "romaneiosTinturaria", null);
    OutController = __decorate([
        (0, common_1.Controller)()
    ], OutController);
    return OutController;
}());
exports.OutController = OutController;
//# sourceMappingURL=out.controller.js.map