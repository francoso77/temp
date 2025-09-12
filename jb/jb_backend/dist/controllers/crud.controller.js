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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrudController = void 0;
var common_1 = require("@nestjs/common");
var crud_controller_cls_1 = require("../services/crud.controller.cls");
var roles_decorator_1 = require("../auth/roles.decorator");
var permissoesTypes_1 = require("../types/permissoesTypes");
var CrudController = /** @class */ (function () {
    function CrudController() {
    }
    CrudController.prototype.incluirComDetalhe = function (master, detalhes, entidadeMaster, entidadeDetalhe, id) {
        return new crud_controller_cls_1.default().incluirComDetalhe(master, entidadeMaster, detalhes, entidadeDetalhe, id);
    };
    CrudController.prototype.incluir = function (criterio, entidade) {
        //testar a permissao da entidade e usuario logado pode incluir
        return new crud_controller_cls_1.default().incluir(criterio, entidade);
    };
    CrudController.prototype.atualizar = function (criterio, entidade) {
        return new crud_controller_cls_1.default().incluir(criterio, entidade);
    };
    CrudController.prototype.query = function (entidade, sql) {
        return new crud_controller_cls_1.default().query({
            entidade: entidade ? entidade : '',
            sql: sql ? sql : ''
        });
    };
    CrudController.prototype.pesquisar = function (entidade, criterio, camposLike, select, relations, campoOrder, comparador, tipoOrder) {
        return new crud_controller_cls_1.default().pesquisar({
            entidade: entidade,
            criterio: criterio,
            camposLike: camposLike ? camposLike : [],
            select: select ? select : [],
            relations: relations ? relations : [],
            campoOrder: campoOrder ? campoOrder : [],
            comparador: comparador ? comparador : "L",
            tipoOrder: tipoOrder ? tipoOrder : "ASC"
        });
    };
    CrudController.prototype.excluir = function (entidade, criterio) {
        return new crud_controller_cls_1.default().excluir(criterio, entidade);
    };
    CrudController.prototype.consultar = function (entidade, joins, criterio, camposLike, select, campoOrder, comparador, tipoOrder, groupBy, having) {
        return new crud_controller_cls_1.default().consultar({
            entidade: entidade,
            joins: joins ? joins : [],
            criterio: criterio,
            camposLike: camposLike ? camposLike : [],
            select: select ? select : [],
            campoOrder: campoOrder ? campoOrder : [],
            comparador: comparador ? comparador : "L",
            tipoOrder: tipoOrder ? tipoOrder : "ASC",
            groupBy: groupBy ? groupBy : '',
            having: having ? having : '',
        });
    };
    __decorate([
        (0, common_1.Post)("incluirComDetalhe"),
        __param(0, (0, common_1.Body)("master")),
        __param(1, (0, common_1.Body)("detalhes")),
        __param(2, (0, common_1.Body)("entidadeMaster")),
        __param(3, (0, common_1.Body)("entidadeDetalhe")),
        __param(4, (0, common_1.Body)("id")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Array, String, String, String]),
        __metadata("design:returntype", void 0)
    ], CrudController.prototype, "incluirComDetalhe", null);
    __decorate([
        (0, common_1.Post)("incluir"),
        (0, roles_decorator_1.Roles)({ modulo: permissoesTypes_1.PermissoesTypes.COR.MODULO, permissao: permissoesTypes_1.PermissoesTypes.COR.PERMISSOES.MANUTENCAO }, { modulo: permissoesTypes_1.PermissoesTypes.UNIDADE_MEDIDA.MODULO, permissao: permissoesTypes_1.PermissoesTypes.UNIDADE_MEDIDA.PERMISSOES.MANUTENCAO }, { modulo: permissoesTypes_1.PermissoesTypes.ESTRUTURA.MODULO, permissao: permissoesTypes_1.PermissoesTypes.ESTRUTURA.PERMISSOES.MANUTENCAO }, 
        // { modulo: PermissoesTypes.MAQUINA.MODULO, permissao: PermissoesTypes.MAQUINA.PERMISSOES.MANUTENCAO },
        { modulo: permissoesTypes_1.PermissoesTypes.PESSOA.MODULO, permissao: permissoesTypes_1.PermissoesTypes.PESSOA.PERMISSOES.MANUTENCAO }, { modulo: permissoesTypes_1.PermissoesTypes.PRAZO.MODULO, permissao: permissoesTypes_1.PermissoesTypes.PRAZO.PERMISSOES.MANUTENCAO }, { modulo: permissoesTypes_1.PermissoesTypes.PRODUTO.MODULO, permissao: permissoesTypes_1.PermissoesTypes.PRODUTO.PERMISSOES.MANUTENCAO }, { modulo: permissoesTypes_1.PermissoesTypes.PEDIDO.MODULO, permissao: permissoesTypes_1.PermissoesTypes.PEDIDO.PERMISSOES.INCLUSAO }, { modulo: permissoesTypes_1.PermissoesTypes.PRODUCAO_MALHARIA.MODULO, permissao: permissoesTypes_1.PermissoesTypes.PRODUCAO_MALHARIA.PERMISSOES.LANCAR }, { modulo: permissoesTypes_1.PermissoesTypes.PRODUCAO_MALHARIA.MODULO, permissao: permissoesTypes_1.PermissoesTypes.PRODUCAO_MALHARIA.PERMISSOES.GRAFICOS }, { modulo: permissoesTypes_1.PermissoesTypes.PRODUCAO_MALHARIA.MODULO, permissao: permissoesTypes_1.PermissoesTypes.PRODUCAO_MALHARIA.PERMISSOES.PERDAS }),
        __param(0, (0, common_1.Body)("criterio")),
        __param(1, (0, common_1.Body)("entidade")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, String]),
        __metadata("design:returntype", Promise)
    ], CrudController.prototype, "incluir", null);
    __decorate([
        (0, common_1.Put)("atualizar"),
        __param(0, (0, common_1.Body)("criterio")),
        __param(1, (0, common_1.Body)("entidade:")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, String]),
        __metadata("design:returntype", Promise)
    ], CrudController.prototype, "atualizar", null);
    __decorate([
        (0, common_1.Post)("query"),
        __param(0, (0, common_1.Body)("entidade:")),
        __param(1, (0, common_1.Body)("sql")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String]),
        __metadata("design:returntype", Promise)
    ], CrudController.prototype, "query", null);
    __decorate([
        (0, common_1.Post)("pesquisar"),
        __param(0, (0, common_1.Body)("entidade")),
        __param(1, (0, common_1.Body)("criterio")),
        __param(2, (0, common_1.Body)("camposLike")),
        __param(3, (0, common_1.Body)("select")),
        __param(4, (0, common_1.Body)("relations")),
        __param(5, (0, common_1.Body)("campoOrder")),
        __param(6, (0, common_1.Body)("comparador")),
        __param(7, (0, common_1.Body)("tipoOrder")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object, Array,
            Array,
            Array,
            Array, String, String]),
        __metadata("design:returntype", Promise)
    ], CrudController.prototype, "pesquisar", null);
    __decorate([
        (0, common_1.Delete)("excluir"),
        __param(0, (0, common_1.Body)("entidade")),
        __param(1, (0, common_1.Body)("criterio")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], CrudController.prototype, "excluir", null);
    __decorate([
        (0, common_1.Post)("consultar"),
        __param(0, (0, common_1.Body)("entidade")),
        __param(1, (0, common_1.Body)("joins")),
        __param(2, (0, common_1.Body)("criterio")),
        __param(3, (0, common_1.Body)("camposLike")),
        __param(4, (0, common_1.Body)("select")),
        __param(5, (0, common_1.Body)("campoOrder")),
        __param(6, (0, common_1.Body)("comparador")),
        __param(7, (0, common_1.Body)("tipoOrder")),
        __param(8, (0, common_1.Body)("groupBy")),
        __param(9, (0, common_1.Body)("having")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Array, Object, Array,
            Array,
            Array, String, String, String, String]),
        __metadata("design:returntype", Promise)
    ], CrudController.prototype, "consultar", null);
    CrudController = __decorate([
        (0, common_1.Controller)(),
        __metadata("design:paramtypes", [])
    ], CrudController);
    return CrudController;
}());
exports.CrudController = CrudController;
//# sourceMappingURL=crud.controller.js.map