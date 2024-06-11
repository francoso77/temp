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
exports.AtletaController = void 0;
var common_1 = require("@nestjs/common");
var crud_controller_cls_1 = require("../services/crud.controller.cls");
var AtletaController = /** @class */ (function () {
    function AtletaController() {
    }
    AtletaController.prototype.create = function (dados, entidade) {
        return new crud_controller_cls_1.default().registrarDados(dados, entidade, 'POST');
    };
    AtletaController.prototype.update = function (dados, entidade) {
        return new crud_controller_cls_1.default().registrarDados(dados, entidade, 'PUT');
    };
    AtletaController.prototype.findNome = function (entidade, nome) {
        return new crud_controller_cls_1.default().pesquisarDados(entidade, nome);
    };
    AtletaController.prototype.findId = function (id, entidade, idGenerico) {
        return new crud_controller_cls_1.default().pesquisarID(id, entidade, idGenerico);
    };
    AtletaController.prototype.delete = function (id, entidade, idGenerico) {
        return new crud_controller_cls_1.default().excluirRegistro(id, entidade, idGenerico);
    };
    AtletaController.prototype.findAll = function (entidade) {
        return new crud_controller_cls_1.default().pesquisarDados(entidade);
    };
    __decorate([
        (0, common_1.Post)(),
        __param(0, (0, common_1.Body)("dados")),
        __param(1, (0, common_1.Body)("entidade")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, String]),
        __metadata("design:returntype", Promise)
    ], AtletaController.prototype, "create", null);
    __decorate([
        (0, common_1.Put)(),
        __param(0, (0, common_1.Body)("dados")),
        __param(1, (0, common_1.Body)("entidade")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, String]),
        __metadata("design:returntype", Promise)
    ], AtletaController.prototype, "update", null);
    __decorate([
        (0, common_1.Get)(),
        __param(0, (0, common_1.Body)("entidade")),
        __param(1, (0, common_1.Query)("nome")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String]),
        __metadata("design:returntype", Promise)
    ], AtletaController.prototype, "findNome", null);
    __decorate([
        (0, common_1.Get)(':id'),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Body)('entidade')),
        __param(2, (0, common_1.Body)('idGenerico')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, String]),
        __metadata("design:returntype", Promise)
    ], AtletaController.prototype, "findId", null);
    __decorate([
        (0, common_1.Delete)(':id'),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Body)('entidade')),
        __param(2, (0, common_1.Body)('idGenerico')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, String]),
        __metadata("design:returntype", Promise)
    ], AtletaController.prototype, "delete", null);
    __decorate([
        (0, common_1.Get)(),
        __param(0, (0, common_1.Body)("entidade")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], AtletaController.prototype, "findAll", null);
    AtletaController = __decorate([
        (0, common_1.Controller)('atletas'),
        __metadata("design:paramtypes", [])
    ], AtletaController);
    return AtletaController;
}());
exports.AtletaController = AtletaController;
//# sourceMappingURL=atleta.controller%20copy.js.map