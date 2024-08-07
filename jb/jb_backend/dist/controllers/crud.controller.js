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
var CrudController = /** @class */ (function () {
    function CrudController() {
    }
    CrudController.prototype.incluirComDetalhe = function (master, detalhes, entidadeMaster, entidadeDetalhe, id) {
        return new crud_controller_cls_1.default().incluirComDetalhe(master, entidadeMaster, detalhes, entidadeDetalhe, id);
    };
    CrudController.prototype.incluir = function (criterio, entidade) {
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
    CrudController.prototype.pesquisar = function (entidade, criterio, camposLike, select, relations) {
        return new crud_controller_cls_1.default().pesquisar({
            entidade: entidade,
            criterio: criterio,
            camposLike: camposLike ? camposLike : [],
            select: select ? select : [],
            relations: relations ? relations : [],
        });
    };
    CrudController.prototype.excluir = function (entidade, criterio) {
        return new crud_controller_cls_1.default().excluir(criterio, entidade);
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
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object, Array,
            Array,
            Array]),
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
    CrudController = __decorate([
        (0, common_1.Controller)(),
        __metadata("design:paramtypes", [])
    ], CrudController);
    return CrudController;
}());
exports.CrudController = CrudController;
// @Post("query")
// query(
//   @Body("entidade") entidade: string,
//   @Body("criterio") criterio: Record<string, any>,
//   @Body("camposLike") camposLike: Array<string>,
//   @Body("select") select: Array<string>,
//   @Body("joins") joins: { tabelaRelacao: string, relacao: string }[],
//   @Body("sql") sql: string,
// ): Promise<RespostaPadraoInterface<any>> {
//   return new ClsCrudController().query({
//     entidade: entidade ? entidade : '',
//     criterio: criterio ? criterio : [],
//     camposLike: camposLike ? camposLike : [],
//     select: select ? select : [],
//     joins: joins,
//     sql: sql ? sql : ''
//   });
// }
//# sourceMappingURL=crud.controller.js.map