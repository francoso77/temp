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
var OutController = /** @class */ (function () {
    function OutController() {
    }
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
    OutController = __decorate([
        (0, common_1.Controller)()
    ], OutController);
    return OutController;
}());
exports.OutController = OutController;
//# sourceMappingURL=out.controller.js.map