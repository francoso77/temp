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
var typeorm_1 = require("typeorm");
var CrudController = /** @class */ (function () {
    function CrudController(repository) {
        this.repository = repository;
        this.crudController = new crud_controller_cls_1.default(this.repository);
    }
    CrudController.prototype.create = function (dados) {
        return this.crudController.registrarDados(dados, 'POST');
    };
    CrudController.prototype.update = function (dados) {
        return this.crudController.registrarDados(dados, 'PUT');
    };
    CrudController.prototype.find = function (nome) {
        if (nome) {
            return this.crudController.pesquisarDados(nome);
        }
        else {
            return this.crudController.pesquisarDados();
        }
    };
    CrudController.prototype.findId = function (id, idGenerico) {
        return this.crudController.pesquisarID(id, idGenerico);
    };
    CrudController.prototype.delete = function (id, idGenerico) {
        return this.crudController.excluirRegistro(id, idGenerico);
    };
    __decorate([
        (0, common_1.Post)(),
        __param(0, (0, common_1.Body)("dados")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], CrudController.prototype, "create", null);
    __decorate([
        (0, common_1.Put)(),
        __param(0, (0, common_1.Body)("dados")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], CrudController.prototype, "update", null);
    __decorate([
        (0, common_1.Get)(),
        __param(0, (0, common_1.Query)("nome")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], CrudController.prototype, "find", null);
    __decorate([
        (0, common_1.Get)(':id'),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Body)('idGenerico')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String]),
        __metadata("design:returntype", Promise)
    ], CrudController.prototype, "findId", null);
    __decorate([
        (0, common_1.Delete)(':id'),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Body)('idGenerico')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String]),
        __metadata("design:returntype", Promise)
    ], CrudController.prototype, "delete", null);
    CrudController = __decorate([
        (0, common_1.Controller)(':entidade'),
        __metadata("design:paramtypes", [typeorm_1.Repository])
    ], CrudController);
    return CrudController;
}());
exports.CrudController = CrudController;
//# sourceMappingURL=atleta.controller.js.map